
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, Globe, Mail, Phone } from "lucide-react";
import { getSwaggerDefinition } from "@/lib/swagger";

interface ApiInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiInfoDialog = ({ open, onOpenChange }: ApiInfoDialogProps) => {
  const swagger = getSwaggerDefinition();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{swagger.info.title}</DialogTitle>
          <DialogDescription>
            {swagger.info.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Version:</span>
            <span>{swagger.info.version}</span>
          </div>
          
          {/* Terms of Service - conditionally render if it exists */}
          {swagger.info.termsOfService && (
            <div>
              <h3 className="font-semibold mb-2">Terms of Service</h3>
              <div className="flex items-center gap-2">
                <a href={swagger.info.termsOfService} target="_blank" rel="noopener noreferrer" className="text-blue-500 flex items-center">
                  <span>{swagger.info.termsOfService}</span>
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          )}
          
          {/* Contact Info - conditionally render if it exists */}
          {swagger.info.contact && (
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="space-y-2">
                {swagger.info.contact.name && (
                  <div className="flex items-center gap-2">
                    <span>{swagger.info.contact.name}</span>
                  </div>
                )}
                
                {swagger.info.contact.url && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a href={swagger.info.contact.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      {swagger.info.contact.url}
                    </a>
                  </div>
                )}
                
                {swagger.info.contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${swagger.info.contact.email}`} className="text-blue-500">
                      {swagger.info.contact.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* License Info - conditionally render if it exists */}
          {swagger.info.license && (
            <div>
              <h3 className="font-semibold mb-2">License</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>{swagger.info.license.name}</span>
                  {swagger.info.license.url && (
                    <a href={swagger.info.license.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 flex items-center">
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div>
            <h3 className="font-semibold mb-2">API Details</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Host:</span>
                <span>{swagger.host || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Base Path:</span>
                <span>{swagger.basePath || '/'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Schemes:</span>
                <span>
                  {swagger.schemes && swagger.schemes.length > 0 
                    ? swagger.schemes.join(', ') 
                    : 'https (default)'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiInfoDialog;
