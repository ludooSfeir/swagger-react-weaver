
import { useState, useEffect } from "react";
import EndpointList from "@/components/endpoints/EndpointList";
import { getTagGroups, getTagInfo, Endpoint } from "@/lib/swagger";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CrudActions, { CrudAction } from "@/components/endpoints/CrudActions";
import EndpointDetail from "@/components/endpoints/EndpointDetail";
import DOMPurify from 'dompurify';

type EntityGroup = {
  name: string;
  endpoints: Endpoint[];
  listEndpoint?: Endpoint;
  viewEndpoint?: Endpoint;
  createEndpoint?: Endpoint;
  updateEndpoint?: Endpoint;
  deleteEndpoint?: Endpoint;
};

const TagDetail = () => {
  const { tagName } = useParams<{ tagName: string }>();
  const tagGroups = getTagGroups();
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [crudAction, setCrudAction] = useState<CrudAction>('list');
  const [entityGroups, setEntityGroups] = useState<EntityGroup[]>([]);
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

  // Group endpoints by entity type
  useEffect(() => {
    if (!endpoints) return;

    const groups: Record<string, EntityGroup> = {};

    // Helper function to normalize path by removing IDs
    const normalizePath = (path: string): string => {
      // Remove trailing IDs like /{id}, /{userId}, etc.
      return path.replace(/\/\{[^}]+\}$/g, '');
    };

    // First pass: create groups based on normalized paths
    endpoints.forEach(endpoint => {
      const normalizedPath = normalizePath(endpoint.path);
      const pathParts = normalizedPath.split('/').filter(Boolean);
      const entityName = pathParts[pathParts.length - 1] || 'default';
      
      if (!groups[normalizedPath]) {
        groups[normalizedPath] = {
          name: entityName,
          endpoints: [],
        };
      }
      
      groups[normalizedPath].endpoints.push(endpoint);
    });

    // Second pass: categorize endpoints by CRUD operation
    Object.values(groups).forEach(group => {
      group.endpoints.forEach(endpoint => {
        const method = endpoint.method.toLowerCase();
        const hasIdParam = endpoint.path.match(/\/\{[^}]+\}$/);
        
        if (method === 'get' && !hasIdParam) {
          group.listEndpoint = endpoint;
        } else if (method === 'get' && hasIdParam) {
          group.viewEndpoint = endpoint;
        } else if (method === 'post') {
          group.createEndpoint = endpoint;
        } else if (method === 'put' || method === 'patch') {
          group.updateEndpoint = endpoint;
        } else if (method === 'delete') {
          group.deleteEndpoint = endpoint;
        }
      });
    });

    // Convert to array and sort by name
    setEntityGroups(Object.values(groups).sort((a, b) => a.name.localeCompare(b.name)));
  }, [endpoints]);

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{tagInfo?.name || tagName}</h1>
          {tagInfo?.description && (
              <p
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tagInfo.description) }}
              />
          )}
        </div>

        {selectedEntityGroup && (
          <CrudActions
            currentAction={crudAction}
            onActionChange={handleCrudAction}
            allowedActions={getAllowedActions(selectedEntityGroup)}
          />
        )}
      </div>

      {selectedEntityGroup && selectedEndpoint ? (
        <EndpointDetail endpoint={selectedEndpoint} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entityGroups.map((group) => (
            <Card 
              key={group.name} 
              className="hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => handleEntitySelect(group)}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default TagDetail;
