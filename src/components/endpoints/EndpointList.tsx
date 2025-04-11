
import { Endpoint } from "@/lib/swagger";
import EndpointCard from "./EndpointCard";

interface EndpointListProps {
  endpoints: Endpoint[];
  title?: string;
}

const EndpointList = ({ endpoints, title }: EndpointListProps) => {
  if (endpoints.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No endpoints found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-xl font-semibold">{title}</h2>
      )}
      <div className="grid gap-4">
        {endpoints.map((endpoint, index) => (
          <EndpointCard key={`${endpoint.method}-${endpoint.path}-${index}`} endpoint={endpoint} />
        ))}
      </div>
    </div>
  );
};

export default EndpointList;
