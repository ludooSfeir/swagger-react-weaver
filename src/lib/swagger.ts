import swaggerFile from '../../swagger.json';

export interface SwaggerDefinition {
  swagger: string;
  info: {
    title: string;
    description: string;
    version: string;
  };
  host: string;
  basePath: string;
  tags: {
    name: string;
    description: string;
  }[];
  paths: Record<string, Record<string, {
    tags: string[];
    summary: string;
    description: string;
    operationId: string;
    consumes?: string[];
    produces?: string[];
    parameters?: {
      name: string;
      in: string;
      description: string;
      required: boolean;
      type?: string;
      schema?: any;
      items?: any;
    }[];
    responses: Record<string, {
      description: string;
      schema?: any;
    }>;
  }>>;
  definitions: Record<string, any>;
}

export const swagger: SwaggerDefinition = swaggerFile as any;

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface Endpoint {
  path: string;
  method: HttpMethod;
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  parameters: {
    name: string;
    in: string; // path, query, body, formData, header
    description: string;
    required: boolean;
    type?: string;
    schema?: any;
    items?: any;
  }[];
  responses: Record<string, {
    description: string;
    schema?: any;
  }>;
}

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

export function getSwaggerDefinition(): SwaggerDefinition {
  return swagger;
}

export function getBaseUrl(): string {
  const swagger = getSwaggerDefinition();
  // Handle the case where schemes doesn't exist
  const scheme = swagger.schemes && swagger.schemes.length > 0 ? swagger.schemes[0] : 'https';
  return `${scheme}://${swagger.host || 'api.example.com'}${swagger.basePath || ''}`;
}

export function getDefinitionExample(ref: string): any {
  if (!ref.startsWith('#/definitions/')) {
    return null;
  }
  
  const definitionName = ref.replace('#/definitions/', '');
  const definition = swagger.definitions[definitionName];
  
  if (!definition) {
    return null;
  }
  
  return buildExampleFromDefinition(definition);
}

function buildExampleFromDefinition(definition: any): any {
  if (!definition) return null;
  
  if (definition.example) {
    return definition.example;
  }
  
  if (definition.type === 'object' && definition.properties) {
    const example: Record<string, any> = {};
    
    Object.entries(definition.properties).forEach(([propName, propSchema]: [string, any]) => {
      if (propSchema.$ref) {
        example[propName] = getDefinitionExample(propSchema.$ref);
      } else if (propSchema.type === 'array' && propSchema.items?.$ref) {
        example[propName] = [getDefinitionExample(propSchema.items.$ref)];
      } else if (propSchema.type === 'array') {
        example[propName] = [];
      } else if (propSchema.type === 'string') {
        example[propName] = propSchema.example || 'string';
      } else if (propSchema.type === 'integer' || propSchema.type === 'number') {
        example[propName] = propSchema.example || 0;
      } else if (propSchema.type === 'boolean') {
        example[propName] = propSchema.example || false;
      } else {
        example[propName] = null;
      }
    });
    
    return example;
  }
  
  if (definition.type === 'array' && definition.items?.$ref) {
    return [getDefinitionExample(definition.items.$ref)];
  }
  
  return null;
}

export function getDefaultValueForType(type: string, format?: string): any {
  switch (type) {
    case 'string':
      if (format === 'date-time') return new Date().toISOString();
      if (format === 'date') return new Date().toISOString().split('T')[0];
      return '';
    case 'integer':
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    case 'object':
      return {};
    default:
      return null;
  }
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
