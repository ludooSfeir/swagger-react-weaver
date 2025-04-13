
import { useState } from "react";
import EndpointDetail from "@/components/endpoints/EndpointDetail";
import { getTagGroups, getTagInfo, Endpoint } from "@/lib/swagger";
import { useParams } from "react-router-dom";
import { useEntityGroups, EntityGroup } from "@/hooks/useEntityGroups";
import EntityGroupsGrid from "@/components/tags/EntityGroupsGrid";
import TagHeader from "@/components/tags/TagHeader";
import { CrudAction } from "@/components/endpoints/CrudActions";

const TagDetail = () => {
  const { tagName } = useParams<{ tagName: string }>();
  const tagGroups = getTagGroups();
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [crudAction, setCrudAction] = useState<CrudAction>('list');
  const [selectedEntityGroup, setSelectedEntityGroup] = useState<EntityGroup | null>(null);
  
  if (!tagName || !tagGroups[tagName]) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Tag Not Found</h1>
        <p className="text-muted-foreground">
          The requested API tag could not be found.
        </p>
      </div>
    );
  }

  const endpoints = tagGroups[tagName];
  const tagInfo = getTagInfo(tagName);
  const entityGroups = useEntityGroups(endpoints);

  const handleEntitySelect = (entityGroup: EntityGroup) => {
    setSelectedEntityGroup(entityGroup);
    
    // Default to list action and endpoint if available
    if (entityGroup.listEndpoint) {
      setCrudAction('list');
      setSelectedEndpoint(entityGroup.listEndpoint);
    } else if (entityGroup.viewEndpoint) {
      setCrudAction('view');
      setSelectedEndpoint(entityGroup.viewEndpoint);
    } else {
      // Choose first available endpoint
      const firstEndpoint = entityGroup.endpoints[0];
      setSelectedEndpoint(firstEndpoint);
      
      // Determine action based on method
      const method = firstEndpoint.method.toLowerCase();
      if (method === 'post') setCrudAction('create');
      else if (method === 'put' || method === 'patch') setCrudAction('update');
      else if (method === 'delete') setCrudAction('delete');
      else setCrudAction('view');
    }
  };

  const handleCrudAction = (action: CrudAction) => {
    setCrudAction(action);
    
    if (!selectedEntityGroup) return;
    
    // Select appropriate endpoint based on action
    switch (action) {
      case 'list':
        setSelectedEndpoint(selectedEntityGroup.listEndpoint || null);
        break;
      case 'view':
        setSelectedEndpoint(selectedEntityGroup.viewEndpoint || null);
        break;
      case 'create':
        setSelectedEndpoint(selectedEntityGroup.createEndpoint || null);
        break;
      case 'update':
        setSelectedEndpoint(selectedEntityGroup.updateEndpoint || null);
        break;
      case 'delete':
        setSelectedEndpoint(selectedEntityGroup.deleteEndpoint || null);
        break;
    }
  };

  const getAllowedActions = (entityGroup: EntityGroup): CrudAction[] => {
    const actions: CrudAction[] = [];
    
    if (entityGroup.listEndpoint) actions.push('list');
    if (entityGroup.viewEndpoint) actions.push('view');
    if (entityGroup.createEndpoint) actions.push('create');
    if (entityGroup.updateEndpoint) actions.push('update');
    if (entityGroup.deleteEndpoint) actions.push('delete');
    
    return actions;
  };

  return (
    <div className="space-y-4">
      <TagHeader 
        tagName={tagName}
        tagInfo={tagInfo}
        selectedEntityGroup={selectedEntityGroup}
        crudAction={crudAction}
        onCrudActionChange={handleCrudAction}
        getAllowedActions={getAllowedActions}
      />

      {selectedEntityGroup && selectedEndpoint ? (
        <EndpointDetail endpoint={selectedEndpoint} />
      ) : (
        <EntityGroupsGrid 
          entityGroups={entityGroups} 
          onEntitySelect={handleEntitySelect}
        />
      )}
    </div>
  );
};

export default TagDetail;
