
import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Trash, Plus, List } from "lucide-react";

export type CrudAction = 'list' | 'create' | 'view' | 'update' | 'delete';

interface CrudActionsProps {
  currentAction: CrudAction;
  onActionChange: (action: CrudAction) => void;
  allowedActions?: CrudAction[];
  disabledActions?: CrudAction[];
  compact?: boolean;
}

const CrudActions: React.FC<CrudActionsProps> = ({
  currentAction,
  onActionChange,
  allowedActions = ['list', 'create', 'view', 'update', 'delete'],
  disabledActions = [],
  compact = false
}) => {
  const actions = [
    { 
      id: 'list' as CrudAction, 
      icon: <List className="h-4 w-4" />, 
      label: 'List', 
      variant: currentAction === 'list' ? 'default' : 'outline'
    },
    { 
      id: 'create' as CrudAction, 
      icon: <Plus className="h-4 w-4" />, 
      label: 'Create', 
      variant: currentAction === 'create' ? 'default' : 'outline'
    },
    { 
      id: 'view' as CrudAction, 
      icon: <Eye className="h-4 w-4" />, 
      label: 'View', 
      variant: currentAction === 'view' ? 'default' : 'outline'
    },
    { 
      id: 'update' as CrudAction, 
      icon: <Pencil className="h-4 w-4" />, 
      label: 'Edit', 
      variant: currentAction === 'update' ? 'default' : 'outline'
    },
    { 
      id: 'delete' as CrudAction, 
      icon: <Trash className="h-4 w-4" />, 
      label: 'Delete', 
      variant: currentAction === 'delete' ? 'destructive' : 'outline'
    }
  ];

  const filteredActions = actions.filter(action => 
    allowedActions.includes(action.id) && !disabledActions.includes(action.id)
  );

  return (
    <div className="flex gap-2 items-center">
      {filteredActions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant as any}
          size="sm"
          onClick={() => onActionChange(action.id)}
          className={`${compact ? 'px-2' : ''}`}
        >
          {action.icon}
          {!compact && <span className="ml-1">{action.label}</span>}
        </Button>
      ))}
    </div>
  );
};

export default CrudActions;
