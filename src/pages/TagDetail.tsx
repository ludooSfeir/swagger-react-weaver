import { useState } from "react";
import EndpointList from "@/components/endpoints/EndpointList";
import { getTagGroups, getTagInfo, Endpoint } from "@/lib/swagger";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CrudActions, { CrudAction } from "@/components/endpoints/CrudActions";
import EndpointDetail from "@/components/endpoints/EndpointDetail";
import DOMPurify from 'dompurify';

const TagDetail = () => {
  const { tagName } = useParams<{ tagName: string }>();
  const tagGroups = getTagGroups();
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [crudAction, setCrudAction] = useState<CrudAction>('list');

  if (!tagName || !tagGroups[tagName]) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Tag Not Found</h1>
        <p className="text-muted-foreground">
          The requested API tag could not be found.
        </p>
      </div>
    );
  }

  const endpoints = tagGroups[tagName];
  const tagInfo = getTagInfo(tagName);

  const handleEndpointSelect = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
    setCrudAction('view');
  };

  const handleCrudAction = (action: CrudAction) => {
    setCrudAction(action);
    if (action === 'list') {
      setSelectedEndpoint(null);
    }
  };

  const findCreateEndpoint = () => {
    return endpoints.find(e => e.method.toLowerCase() === 'post');
  };

  // Conditionally select a "create" endpoint when user clicks on create
  if (crudAction === 'create' && !selectedEndpoint) {
    const createEndpoint = findCreateEndpoint();
    if (createEndpoint) {
      setSelectedEndpoint(createEndpoint);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{tagInfo?.name || tagName}</h1>
          {tagInfo?.description && (
              <p
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tagInfo.description) }}
              />
          )}
        </div>

        <CrudActions
          currentAction={crudAction}
          onActionChange={handleCrudAction}
          allowedActions={['list', 'create', 'view', 'update', 'delete']}
        />
      </div>

      {crudAction === 'list' ? (
        <EndpointList
          endpoints={endpoints}
          onSelect={handleEndpointSelect}
        />
      ) : selectedEndpoint ? (
        <EndpointDetail endpoint={selectedEndpoint} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Endpoint Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please select an endpoint from the list or return to list view.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TagDetail;
