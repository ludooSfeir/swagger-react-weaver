
import { Button } from "@/components/ui/button";
import { swagger } from "@/lib/swagger";
import { FileCode, Info, Menu } from "lucide-react";
import { useState } from "react";
import ApiInfoDialog from "../dialogs/ApiInfoDialog";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [infoOpen, setInfoOpen] = useState(false);
  
  return (
    <header className="h-16 px-6 border-b bg-background flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <FileCode className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">{swagger.info.title}</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setInfoOpen(true)}>
          <Info className="h-4 w-4 mr-2" />
          API Info
        </Button>
      </div>
      
      <ApiInfoDialog open={infoOpen} onOpenChange={setInfoOpen} />
    </header>
  );
};

export default Header;
