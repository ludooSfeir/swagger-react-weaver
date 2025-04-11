
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getEndpoints, getTagGroups, swagger } from "@/lib/swagger";
import { ActivitySquare, FileText, Server, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const endpoints = getEndpoints();
  const tagGroups = getTagGroups();
  const tags = Object.keys(tagGroups);
  
  // Count HTTP methods
  const methodCounts: Record<string, number> = {};
  endpoints.forEach(endpoint => {
    methodCounts[endpoint.method] = (methodCounts[endpoint.method] || 0) + 1;
  });
  
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
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">API Resources</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tags.map(tag => {
            const endpoints = tagGroups[tag];
            return (
              <Link key={tag} to={`/tags/${tag}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      {tag}
                    </CardTitle>
                    <CardDescription>
                      {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {endpoints.map(e => e.method).join(', ')}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
