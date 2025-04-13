
import React from "react";
import CrudActions, { CrudAction } from "@/components/endpoints/CrudActions";
import { EntityGroup } from "@/hooks/useEntityGroups";
import DOMPurify from 'dompurify';

interface TagHeaderProps {
  tagName: string;
  tagInfo?: { name: string; description: string } | undefined;
  selectedEntityGroup: EntityGroup | null;
  crudAction: CrudAction;
  onCrudActionChange: (action: CrudAction) => void;
  getAllowedActions: (entityGroup: EntityGroup) => CrudAction[];
}

const TagHeader: React.FC<TagHeaderProps> = ({
  tagName,
  tagInfo,
  selectedEntityGroup,
  crudAction,
  onCrudActionChange,
  getAllowedActions
}) => {
  return (
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

      {selectedEntityGroup && (
        <CrudActions
          currentAction={crudAction}
          onActionChange={onCrudActionChange}
          allowedActions={getAllowedActions(selectedEntityGroup)}
        />
      )}
    </div>
  );
};

export default TagHeader;
