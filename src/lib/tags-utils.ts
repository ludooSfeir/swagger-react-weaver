
import { getTagGroups } from './endpoints-utils';

export function getCategorizedTags(): Record<string, string[]> {
  // Define categories and associated tags
  const categories: Record<string, string[]> = {
    'Database': [
      'postgres', 'mysql', 'redis', 'mongodb', 
      'mssql', 'sybase', 'oracleitc', 'oracle dbaas', 'oracle container',
      'database', 'sql', 'nosql'
    ],
    'Server': ['server', 'nginx', 'apache', 'webserver'],
    'Kubernetes': ['kubernetes', 'k8s', 'container', 'pod', 'deployment'],
    'Storage': ['storage', 's3', 'blob', 'filesystems', 'volumes'],
    'Authentication': ['auth', 'oauth', 'users', 'identity', 'security'],
    'Monitoring': ['monitoring', 'logging', 'metrics', 'tracing', 'alerts'],
    'API': ['rest', 'graphql', 'soap', 'endpoints']
  };
  
  // Get all available tags from the Swagger definition
  const availableTags = getTagGroups();
  const tagNames = Object.keys(availableTags);
  
  // Categorize tags based on the defined categories
  const categorizedTags: Record<string, string[]> = {};
  
  // First, try to categorize existing tags
  Object.entries(categories).forEach(([category, relatedTags]) => {
    categorizedTags[category] = [];
    
    tagNames.forEach(tag => {
      // Check if this tag belongs to the current category
      const normalizedTag = tag.toLowerCase();
      const belongsToCategory = relatedTags.some(relatedTag => 
        normalizedTag.includes(relatedTag) || 
        relatedTag.includes(normalizedTag)
      );
      
      if (belongsToCategory) {
        categorizedTags[category].push(tag);
      }
    });
  });
  
  // Add "Other" category for uncategorized tags
  categorizedTags['Other'] = tagNames.filter(tag => {
    return !Object.values(categorizedTags).flat().includes(tag);
  });
  
  // Remove empty categories
  Object.keys(categorizedTags).forEach(category => {
    if (categorizedTags[category].length === 0) {
      delete categorizedTags[category];
    }
  });
  
  return categorizedTags;
}
