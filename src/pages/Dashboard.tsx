
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategorizedTags, getEndpoints, getTagGroups, getTagInfo, swagger } from "@/lib/swagger";
import { ActivitySquare, Database, FileText, Server, Tag, Bot, Shield, BarChart, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";

const Dashboard = () => {
  const endpoints = getEndpoints();
  const tagGroups = getTagGroups();
  const tags = Object.keys(tagGroups);
  const categorizedTags = getCategorizedTags();

  // Count HTTP methods
  const methodCounts: Record<string, number> = {};
  endpoints.forEach(endpoint => {
    methodCounts[endpoint.method] = (methodCounts[endpoint.method] || 0) + 1;
  });

  // Define category icons
  const categoryIcons: Record<string, React.ReactNode> = {
    'Database': <Database className="h-5 w-5" />,
    'Server': <Server className="h-5 w-5" />,
    'Kubernetes': <Bot className="h-5 w-5" />,
    'Storage': <Database className="h-5 w-5" />,
    'Authentication': <Shield className="h-5 w-5" />,
    'Monitoring': <BarChart className="h-5 w-5" />,
    'API': <Globe className="h-5 w-5" />,
    'Other': <Tag className="h-5 w-5" />
  };

  // Calculate entity counts per tag
  const getEntityCount = (tagName: string): number => {
    const endpoints = tagGroups[tagName];
    if (!endpoints || endpoints.length === 0) return 0;
    
    const entityGroups: Set<string> = new Set();
    
    endpoints.forEach(endpoint => {
      // Normalize path by removing trailing IDs
      const normalizedPath = endpoint.path.replace(/\/\{[^}]+\}$/g, '');
      entityGroups.add(normalizedPath);
    });
    
    return entityGroups.size;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{swagger.info.title}</h1>
        <p className="text-muted-foreground">
          API Explorer for {swagger.info.title} v{swagger.info.version}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">API Version</CardTitle>
            <CardDescription>Current version of the API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{swagger.info.version}</div>
          </CardContent>
          <CardFooter className="pt-1">
            <FileText className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-xs text-muted-foreground">Swagger {swagger.swagger}</span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resource Tags</CardTitle>
            <CardDescription>API resource categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tags.length}</div>
          </CardContent>
          <CardFooter className="pt-1">
            <Tag className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-xs text-muted-foreground">Resource categories</span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Endpoints</CardTitle>
            <CardDescription>Available API operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{endpoints.length}</div>
          </CardContent>
          <CardFooter className="pt-1">
            <Server className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-xs text-muted-foreground">API endpoints</span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">HTTP Methods</CardTitle>
            <CardDescription>Types of operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(methodCounts).length}</div>
          </CardContent>
          <CardFooter className="pt-1">
            <ActivitySquare className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-xs text-muted-foreground">Distinct method types</span>
          </CardFooter>
        </Card>
      </div>

      {/* Categorized API Resources */}
      <div className="space-y-8">
        {Object.entries(categorizedTags).map(([category, categoryTags]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2">
              {categoryIcons[category]}
              <h2 className="text-xl font-semibold">{category}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryTags.map(tag => {
                const endpoints = tagGroups[tag];
                const tagInfo = getTagInfo(tag);
                const entityCount = getEntityCount(tag);
                
                return (
                  <Link key={tag} to={`/tags/${tag}`}>
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Tag className="h-5 w-5" />
                          {tagInfo?.name || tag}
                        </CardTitle>
                        <CardDescription>
                          {entityCount} entit{entityCount !== 1 ? 'ies' : 'y'} ({endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''})
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {tagInfo?.description ? (
                          <p className="text-sm text-muted-foreground line-clamp-2"
                             dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tagInfo.description) }}
                          >
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {endpoints.map(e => e.method).join(', ')}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
