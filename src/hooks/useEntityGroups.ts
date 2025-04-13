
import { useState, useEffect } from "react";
import { Endpoint } from "@/lib/swagger";

export type EntityGroup = {
  name: string;
  endpoints: Endpoint[];
  listEndpoint?: Endpoint;
  viewEndpoint?: Endpoint;
  createEndpoint?: Endpoint;
  updateEndpoint?: Endpoint;
  deleteEndpoint?: Endpoint;
};

export const useEntityGroups = (endpoints: Endpoint[] | undefined) => {
  const [entityGroups, setEntityGroups] = useState<EntityGroup[]>([]);

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

  return entityGroups;
};
