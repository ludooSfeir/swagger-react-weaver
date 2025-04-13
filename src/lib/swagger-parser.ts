
import { swagger, SwaggerDefinition } from './api-types';

export function getSwaggerDefinition(): SwaggerDefinition {
  return swagger;
}

export function getBaseUrl(): string {
  const swagger = getSwaggerDefinition();
  // Handle the case where schemes doesn't exist
  const scheme = swagger.schemes && swagger.schemes.length > 0 ? swagger.schemes[0] : 'https';
  return `${scheme}://${swagger.host || 'api.example.com'}${swagger.basePath || ''}`;
}
