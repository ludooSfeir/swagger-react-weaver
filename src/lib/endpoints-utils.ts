
import { Endpoint, HttpMethod, swagger } from './api-types';

export function getEndpoints(): Endpoint[] {
  const endpoints: Endpoint[] = [];
  
  Object.entries(swagger.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, details]) => {
      endpoints.push({
        path,
        method: method as HttpMethod,
        tags: details.tags || [],
        summary: details.summary || '',
        description: details.description || '',
        operationId: details.operationId || '',
        parameters: details.parameters || [],
        responses: details.responses || {}
      });
    });
  });
  
  return endpoints;
}

export function getTagGroups(): Record<string, Endpoint[]> {
  const endpoints = getEndpoints();
  const tagGroups: Record<string, Endpoint[]> = {};
  
  endpoints.forEach(endpoint => {
    if (endpoint.tags.length === 0) {
      if (!tagGroups['Other']) {
        tagGroups['Other'] = [];
      }
      tagGroups['Other'].push(endpoint);
    } else {
      endpoint.tags.forEach(tag => {
        if (!tagGroups[tag]) {
          tagGroups[tag] = [];
        }
        tagGroups[tag].push(endpoint);
      });
    }
  });
  
  return tagGroups;
}

export function getTagInfo(tagName: string): { name: string, description: string } | undefined {
  return swagger.tags.find(tag => tag.name === tagName);
}

export function getOperationColor(method: HttpMethod): string {
  switch (method) {
    case 'get': return 'get';
    case 'post': return 'post';
    case 'put': return 'put';
    case 'delete': return 'delete';
    case 'patch': return 'patch';
    default: return 'muted';
  }
}
