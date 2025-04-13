
import { swagger } from './api-types';

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
