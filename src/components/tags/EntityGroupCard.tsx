
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Endpoint } from "@/lib/swagger";

interface EntityGroupProps {
  group: {
    name: string;
    endpoints: Endpoint[];
    listEndpoint?: Endpoint;
    viewEndpoint?: Endpoint;
    createEndpoint?: Endpoint;
    updateEndpoint?: Endpoint;
    deleteEndpoint?: Endpoint;
  };
  onSelect: (group: any) => void;
}

const EntityGroupCard: React.FC<EntityGroupProps> = ({ group, onSelect }) => {
  return (
    <Card 
      className="hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => onSelect(group)}
    >
      <CardHeader>
        <CardTitle className="text-lg capitalize">{group.name}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {group.endpoints.length} operation{group.endpoints.length !== 1 ? 's' : ''}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {group.listEndpoint && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">List</span>
          )}
          {group.viewEndpoint && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">View</span>
          )}
          {group.createEndpoint && (
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Create</span>
          )}
          {group.updateEndpoint && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Update</span>
          )}
          {group.deleteEndpoint && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Delete</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EntityGroupCard;
