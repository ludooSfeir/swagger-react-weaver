
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { executeApiRequest, generateInitialFormValues } from "@/lib/api-utils";
import { Endpoint, getOperationColor } from "@/lib/swagger";
import { ChevronLeft, Play, Save } from "lucide-react";
import { useState, useEffect } from "react";
import EndpointForm from "./EndpointForm";
import { CrudAction } from "./CrudActions";
import ListDataView from "./ListDataView";

interface EndpointDetailProps {
  endpoint: Endpoint;
}

const EndpointDetail = ({ endpoint }: EndpointDetailProps) => {
  const { toast } = useToast();
  const [formValues, setFormValues] = useState<Record<string, any>>(
    generateInitialFormValues(endpoint)
  );
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [crudAction, setCrudAction] = useState<CrudAction>('view');
  const operationColor = getOperationColor(endpoint.method);
  
  useEffect(() => {
    // Reset form values when endpoint changes
    setFormValues(generateInitialFormValues(endpoint));
    setResponse(null);
    
    // Determine appropriate CRUD action based on method
    const method = endpoint.method.toLowerCase();
    const hasIdParam = endpoint.path.match(/\/\{[^}]+\}$/);
    
    if (method === 'get' && !hasIdParam) {
      setCrudAction('list');
    } else if (method === 'get' && hasIdParam) {
      setCrudAction('view');
    } else if (method === 'post') {
      setCrudAction('create');
    } else if (method === 'put' || method === 'patch') {
      setCrudAction('update');
    } else if (method === 'delete') {
      setCrudAction('delete');
    }

    // Auto-fetch for list and view operations
    if ((crudAction === 'list' || crudAction === 'view') && method === 'get') {
      handleSubmit();
    }
  }, [endpoint]);
  
  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await executeApiRequest(endpoint, formValues);
      setResponse(result);
      
      if (!result.ok) {
        toast({
          title: `Error ${result.status}`,
          description: "The request failed. Check the response for details.",
          variant: "destructive",
        });
      } else if (crudAction !== 'list') {
        // Only show success toast for non-list operations
        toast({
          title: `Success ${result.status}`,
          description: "Request completed successfully!",
        });
      }
    } catch (error) {
      console.error("Request error:", error);
      toast({
        title: "Request Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Extract entity name from the path
  const getEntityName = (): string => {
    // Remove trailing IDs and API version prefixes
    const cleanPath = endpoint.path
      .replace(/\/\{[^}]+\}$/g, '')
      .replace(/^\/api\/v\d+\//, '');
    
    const parts = cleanPath.split('/').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : 'resource';
  };

  const entityName = getEntityName();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base capitalize">
              {entityName} - {endpoint.summary}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <span 
                className="text-xs font-bold text-white px-2 py-1 rounded uppercase"
                style={{ backgroundColor: `var(--${operationColor})` }}
              >
                {endpoint.method}
              </span>
            </div>
          </div>
          <CardDescription>
            {endpoint.description || `${crudAction} operation for ${entityName}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EndpointForm 
            endpoint={endpoint} 
            formValues={formValues} 
            onChange={handleChange}
            readOnly={crudAction === 'view' || crudAction === 'delete' || crudAction === 'list'}
          />
          
          <div className="mt-6 flex justify-end">
            {crudAction !== 'list' && (
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className={`${crudAction === 'delete' ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
              >
                <Play className="mr-2 h-4 w-4" />
                {crudAction === 'create' ? 'Create' :
                 crudAction === 'update' ? 'Update' :
                 crudAction === 'delete' ? 'Delete' : 'Execute'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {crudAction === 'list' && response && (
        <ListDataView response={response} entityName={entityName} />
      )}
      
      {crudAction !== 'list' && response && response.error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error {response.status}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{response.error}</p>
          </CardContent>
        </Card>
      )}
      
      {crudAction !== 'list' && response && !response.error && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded overflow-auto max-h-80">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EndpointDetail;
