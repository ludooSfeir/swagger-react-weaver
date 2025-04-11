
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { swagger } from "@/lib/swagger";
import { FileText } from "lucide-react";

interface ApiInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiInfoDialog = ({ open, onOpenChange }: ApiInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {swagger.info.title}
          </DialogTitle>
          <DialogDescription>
            API Version: {swagger.info.version}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">
              {swagger.info.description || "No description available"}
            </p>
          </div>
          
          {swagger.info.termsOfService && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Terms of Service</h3>
              <p className="text-sm text-muted-foreground">
                <a href={swagger.info.termsOfService} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {swagger.info.termsOfService}
                </a>
              </p>
            </div>
          )}
          
          {swagger.info.contact && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Contact</h3>
              <div className="text-sm text-muted-foreground">
                {swagger.info.contact.name && <p>{swagger.info.contact.name}</p>}
                {swagger.info.contact.email && (
                  <p>
                    <a href={`mailto:${swagger.info.contact.email}`} className="text-blue-500 hover:underline">
                      {swagger.info.contact.email}
                    </a>
                  </p>
                )}
                {swagger.info.contact.url && (
                  <p>
                    <a href={swagger.info.contact.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {swagger.info.contact.url}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
          
          {swagger.info.license && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">License</h3>
              <p className="text-sm text-muted-foreground">
                {swagger.info.license.name}
                {swagger.info.license.url && (
                  <a href={swagger.info.license.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                    (View License)
                  </a>
                )}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Base URL</h3>
            <p className="text-sm font-mono bg-muted p-2 rounded">
              {swagger.schemes?.[0] || 'https'}://{swagger.host}{swagger.basePath || ''}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiInfoDialog;
