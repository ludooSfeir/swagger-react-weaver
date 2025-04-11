
import EndpointDetail from "@/components/endpoints/EndpointDetail";
import { getEndpoints } from "@/lib/swagger";
import { useParams } from "react-router-dom";

const EndpointDetailPage = () => {
  const { operationId } = useParams<{ operationId: string }>();
  const endpoints = getEndpoints();
  const endpoint = endpoints.find(e => e.operationId === operationId);
  
  if (!endpoint) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Endpoint Not Found</h1>
        <p className="text-muted-foreground">
          The requested API endpoint could not be found.
        </p>
      </div>
    );
  }
  
  return <EndpointDetail endpoint={endpoint} />;
};

export default EndpointDetailPage;
