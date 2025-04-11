import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { executeApiRequest, generateInitialFormValues } from "@/lib/api-utils";
import { Endpoint, getOperationColor } from "@/lib/swagger";
import { ChevronLeft, Play, Save } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import EndpointForm from "./EndpointForm";
import ResponseView from "./ResponseView";
import CrudActions, { CrudAction } from "./CrudActions";

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
  const [crudAction, setCrudAction] = useState<CrudAction>('update');
  const operationColor = getOperationColor(endpoint.method);
  
  const getDefaultCrudAction = (method: string): CrudAction => {
    switch (method.toLowerCase()) {
      case 'get': return 'view';
      case 'post': return 'create';
      case 'put':
      case 'patch': return 'update';
      case 'delete': return 'delete';
      default: return 'view';
    }
  };

  useState(() => {
    setCrudAction(getDefaultCrudAction(endpoint.method));
  });
  
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
      } else {
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

  const copyAsCurl = () => {
    const curlCommand = `curl -X ${endpoint.method.toUpperCase()} "https://api.example.com${endpoint.path}"`;
    navigator.clipboard.writeText(curlCommand);
    toast({
      title: "Copied to clipboard",
      description: "CURL command copied to clipboard"
    });
  };

  const getAllowedActions = (): CrudAction[] => {
    return ['list', 'create', 'view', 'update', 'delete'];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/tags/${endpoint.tags[0] || ''}`}>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </Link>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="text-xs font-bold text-white px-2 py-1 rounded uppercase"
                style={{ backgroundColor: `var(--${operationColor})` }}
              >
                {endpoint.method}
              </span>
              <h1 className="text-xl font-semibold">{endpoint.summary}</h1>
            </div>
            {endpoint.description && (
              <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
            )}
          </div>
        </div>
        
        <CrudActions 
          currentAction={crudAction} 
          onActionChange={setCrudAction} 
          allowedActions={getAllowedActions()}
        />
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">
              {crudAction === 'view' ? 'View Details' : 
               crudAction === 'update' ? 'Edit Details' :
               crudAction === 'create' ? 'Create New' :
               crudAction === 'delete' ? 'Delete Confirmation' : 'List Items'}
            </CardTitle>
          </div>
          <CardDescription>
            {crudAction === 'view' ? 'View the resource details' : 
             crudAction === 'update' ? 'Modify the resource properties' :
             crudAction === 'create' ? 'Create a new resource' :
             crudAction === 'delete' ? 'Confirm resource deletion' : 'Browse available resources'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EndpointForm 
            endpoint={endpoint} 
            formValues={formValues} 
            onChange={handleChange}
            readOnly={crudAction === 'view' || crudAction === 'delete'}
          />
          
          <div className="mt-6 flex justify-end">
            {crudAction !== 'list' && (
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || crudAction === 'view'}
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
      
      {response && (
        <ResponseView response={response} />
      )}
    </div>
  );
};

export default EndpointDetail;
