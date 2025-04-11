
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getCategorizedTags, getTagInfo } from "@/lib/swagger";
import { Link, useLocation } from "react-router-dom";
import { 
  ActivitySquare, 
  Database, 
  FileText, 
  LayoutDashboard, 
  Server, 
  Tag, 
  Bot, 
  Shield, 
  BarChart, 
  Globe, 
  ChevronDown,
  ChevronRight,
  Hash
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const categorizedTags = getCategorizedTags();
  
  // Track expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    // Start with all categories expanded
    const expanded: Record<string, boolean> = {};
    Object.keys(categorizedTags).forEach(category => {
      expanded[category] = false; // Default to collapsed for a more compact UI
    });
    
    // Expand the current category if we're on a tag page
    if (location.pathname.startsWith('/tags/')) {
      const currentTag = location.pathname.split('/').pop() || '';
      
      // Find which category the current tag belongs to
      Object.entries(categorizedTags).forEach(([category, tags]) => {
        if (tags.includes(currentTag)) {
          expanded[category] = true;
        }
      });
    }
    
    return expanded;
  });
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // Define category icons
  const categoryIcons: Record<string, React.ReactNode> = {
    'Database': <Database className="h-4 w-4" />,
    'Server': <Server className="h-4 w-4" />,
    'Kubernetes': <Bot className="h-4 w-4" />,
    'Storage': <Database className="h-4 w-4" />,
    'Authentication': <Shield className="h-4 w-4" />,
    'Monitoring': <BarChart className="h-4 w-4" />,
    'API': <Globe className="h-4 w-4" />,
    'Other': <ActivitySquare className="h-4 w-4" />
  };
  
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform duration-300 md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-4">
          <div>
            <Link to="/">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                API Explorer
              </h2>
            </Link>
            <Separator className="mb-4" />
          </div>
          
          <div className="space-y-1">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "default" : "ghost"} 
                className="w-full justify-start"
                size="sm"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="space-y-1">
            <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              API Resources
            </h3>
            
            {Object.entries(categorizedTags).map(([category, tags]) => {
              const isActiveCategory = tags.some(tag => location.pathname === `/tags/${tag}`);
              
              return (
                <div key={category} className="space-y-1 py-1">
                  <Button
                    variant={isActiveCategory ? "secondary" : "ghost"}
                    className="w-full justify-between py-1 px-2 h-8"
                    onClick={() => toggleCategory(category)}
                    size="sm"
                  >
                    <div className="flex items-center">
                      {categoryIcons[category] || <Tag className="mr-2 h-4 w-4" />}
                      <span className="ml-2 text-sm">{category}</span>
                    </div>
                    {expandedCategories[category] ? (
                      <ChevronDown className="h-3 w-3 opacity-70" />
                    ) : (
                      <ChevronRight className="h-3 w-3 opacity-70" />
                    )}
                  </Button>
                  
                  {expandedCategories[category] && (
                    <div className="ml-6 space-y-1">
                      {tags.map(tag => {
                        const tagInfo = getTagInfo(tag);
                        const isActive = location.pathname === `/tags/${tag}`;
                        return (
                          <Link key={tag} to={`/tags/${tag}`}>
                            <Button
                              variant={isActive ? "default" : "ghost"}
                              className="w-full justify-start h-7 text-xs"
                              size="sm"
                            >
                              <Hash className="mr-1 h-3 w-3" />
                              {tagInfo?.name || tag}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
