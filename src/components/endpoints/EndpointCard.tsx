
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Endpoint, getOperationColor } from "@/lib/swagger";
import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface EndpointCardProps {
  endpoint: Endpoint;
}

const EndpointCard = ({ endpoint }: EndpointCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const operationColor = getOperationColor(endpoint.method);
  
  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: `var(--${operationColor})` }}>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="text-xs font-bold text-white px-2 py-1 rounded uppercase"
                style={{ backgroundColor: `var(--${operationColor})` }}
              >
                {endpoint.method}
              </span>
              <code className="font-mono text-sm">{endpoint.path}</code>
            </div>
            <CardTitle className="text-base font-medium">{endpoint.summary}</CardTitle>
            {endpoint.description && (
              <CardDescription className="line-clamp-2 mt-1">
                {endpoint.description}
              </CardDescription>
            )}
          </div>
          
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="flex flex-col gap-4">
              {endpoint.description && (
                <div>
                  <h4 className="font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                </div>
              )}
              
              {endpoint.parameters && endpoint.parameters.length > 0 && (
                <div>
                  <h4 className="font-medium mb-1">Parameters</h4>
                  <div className="text-sm">
                    {endpoint.parameters.map(param => (
                      <div key={param.name} className="flex items-start gap-2 mb-1">
                        <span className="bg-muted px-1.5 py-0.5 rounded text-xs">
                          {param.in}
                        </span>
                        <div>
                          <span className="font-mono">
                            {param.name}
                            {param.required && <span className="text-red-500 ml-1">*</span>}
                          </span>
                          {param.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{param.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Link to={`/endpoints/${endpoint.operationId}`}>
                  <Button size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Try it
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default EndpointCard;
