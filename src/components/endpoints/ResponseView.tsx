
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface ResponseViewProps {
  response: {
    ok: boolean;
    status: number;
    data: any;
    error?: string;
  };
}

const ResponseView = ({ response }: ResponseViewProps) => {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500";
    if (status >= 300 && status < 400) return "bg-blue-500";
    if (status >= 400 && status < 500) return "bg-yellow-500";
    if (status >= 500) return "bg-red-500";
    return "bg-gray-500";
  };
  
  const formatData = (data: any) => {
    if (typeof data === 'string') {
      try {
        // Try to parse as JSON for pretty printing
        const parsed = JSON.parse(data);
        return JSON.stringify(parsed, null, 2);
      } catch {
        // If not JSON, return as is
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Response</CardTitle>
          <Badge className={getStatusColor(response.status)}>
            Status: {response.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="body" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="body" className="flex-1">Body</TabsTrigger>
            <TabsTrigger value="headers" className="flex-1">Headers</TabsTrigger>
          </TabsList>
          <TabsContent value="body" className="mt-4">
            {response.error ? (
              <div className="text-red-500 p-4 border rounded">
                {response.error}
              </div>
            ) : (
              <Textarea
                className="font-mono h-80 w-full"
                readOnly
                value={formatData(response.data)}
              />
            )}
          </TabsContent>
          <TabsContent value="headers" className="mt-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Note: Full response headers are not available due to browser limitations.
              </p>
              <div className="border rounded p-4">
                <p className="text-sm"><strong>Status:</strong> {response.status}</p>
                <p className="text-sm"><strong>OK:</strong> {response.ok ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResponseView;
