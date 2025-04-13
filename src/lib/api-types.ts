
import swaggerFile from '../../swagger.json';

export interface SwaggerDefinition {
  swagger: string;
  info: {
    title: string;
    description: string;
    version: string;
    termsOfService?: string;
    contact?: {
      name?: string;
      url?: string;
      email?: string;
    };
    license?: {
      name?: string;
      url?: string;
    };
  };
  host: string;
  basePath: string;
  schemes?: string[];
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
