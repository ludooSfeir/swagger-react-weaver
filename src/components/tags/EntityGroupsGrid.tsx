
import React from "react";
import { EntityGroup } from "@/hooks/useEntityGroups";
import EntityGroupCard from "./EntityGroupCard";

interface EntityGroupsGridProps {
  entityGroups: EntityGroup[];
  onEntitySelect: (entityGroup: EntityGroup) => void;
}

const EntityGroupsGrid: React.FC<EntityGroupsGridProps> = ({ 
  entityGroups, 
  onEntitySelect 
}) => {
  if (entityGroups.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No entity groups found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {entityGroups.map((group) => (
        <EntityGroupCard 
          key={group.name} 
          group={group} 
          onSelect={onEntitySelect}
        />
      ))}
    </div>
  );
};

export default EntityGroupsGrid;
