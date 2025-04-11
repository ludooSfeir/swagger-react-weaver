
import EndpointList from "@/components/endpoints/EndpointList";
import { getTagGroups, getTagInfo } from "@/lib/swagger";
import { useParams } from "react-router-dom";

const TagDetail = () => {
  const { tagName } = useParams<{ tagName: string }>();
  const tagGroups = getTagGroups();
  
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
  
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{tagInfo?.name || tagName}</h1>
        {tagInfo?.description && (
          <p className="text-muted-foreground">{tagInfo.description}</p>
        )}
      </div>
      
      <EndpointList endpoints={endpoints} />
    </div>
  );
};

export default TagDetail;
