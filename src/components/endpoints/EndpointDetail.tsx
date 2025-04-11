
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { executeApiRequest, generateInitialFormValues } from "@/lib/api-utils";
import { Endpoint, getOperationColor } from "@/lib/swagger";
import { ChevronLeft, Play, Save, Eye, Edit, Trash, List, Copy } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import EndpointForm from "./EndpointForm";
import ResponseView from "./ResponseView";

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
  const [mode, setMode] = useState<'view' | 'edit' | 'add'>('edit');
  const operationColor = getOperationColor(endpoint.method);
  
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
    // Simple implementation - could be enhanced
    const curlCommand = `curl -X ${endpoint.method.toUpperCase()} "https://api.example.com${endpoint.path}"`;
    navigator.clipboard.writeText(curlCommand);
    toast({
      title: "Copied to clipboard",
      description: "CURL command copied to clipboard"
    });
  };
  
  return (
    <div className="space-y-6">
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
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Request Parameters</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMode('view')}
                className={mode === 'view' ? 'bg-muted' : ''}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMode('edit')}
                className={mode === 'edit' ? 'bg-muted' : ''}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={copyAsCurl}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy cURL
              </Button>
            </div>
          </div>
          <CardDescription>
            Fill in the parameters to make a request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EndpointForm 
            endpoint={endpoint} 
            formValues={formValues} 
            onChange={handleChange}
            readOnly={mode === 'view'}
          />
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || mode === 'view'}
              className="bg-primary hover:bg-primary/90"
            >
              <Play className="mr-2 h-4 w-4" />
              Execute Request
            </Button>
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
