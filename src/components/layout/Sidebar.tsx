
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getTagGroups, getTagInfo } from "@/lib/swagger";
import { Link, useLocation } from "react-router-dom";
import { Tag } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const tagGroups = getTagGroups();
  const tags = Object.keys(tagGroups);
  
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform duration-300 md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <ScrollArea className="flex-1 px-4 py-6">
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
              >
                Dashboard
              </Button>
            </Link>
          </div>
          
          <div>
            <h3 className="mb-2 px-2 text-sm font-semibold tracking-tight">
              API Resources
            </h3>
            <div className="space-y-1">
              {tags.map(tag => {
                const tagInfo = getTagInfo(tag);
                const isActive = location.pathname === `/tags/${tag}`;
                return (
                  <Link key={tag} to={`/tags/${tag}`}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start"
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      {tagInfo?.name || tag}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
