
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { executeApiRequest, generateInitialFormValues } from "@/lib/api-utils";
import { Endpoint, getOperationColor } from "@/lib/swagger";
import { ChevronLeft, Play } from "lucide-react";
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
            <code className="font-mono text-sm">{endpoint.path}</code>
          </div>
          <h1 className="text-xl font-semibold">{endpoint.summary}</h1>
          {endpoint.description && (
            <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="form" className="space-y-4">
        <TabsList>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="curl">CURL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Request Parameters</CardTitle>
              <CardDescription>
                Fill in the parameters to make a request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EndpointForm 
                endpoint={endpoint} 
                formValues={formValues} 
                onChange={handleChange}
              />
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
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
        </TabsContent>
        
        <TabsContent value="curl">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">CURL Command</CardTitle>
              <CardDescription>
                Copy and use this command to make the request outside the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                readOnly
                className="font-mono text-sm h-24"
                value={`curl -X ${endpoint.method.toUpperCase()} "https://api.example.com${endpoint.path}"`}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Note: This is a simplified CURL command. Parameters need to be added manually.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EndpointDetail;
