
import { FormControl, FormDescription, FormField, FormItem, FormLabel, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Endpoint } from "@/lib/swagger";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface EndpointFormProps {
  endpoint: Endpoint;
  formValues: Record<string, any>;
  onChange: (name: string, value: any) => void;
  readOnly?: boolean;
}

const EndpointForm = ({ endpoint, formValues, onChange, readOnly = false }: EndpointFormProps) => {
  const hasParameters = endpoint.parameters && endpoint.parameters.length > 0;
  
  // Initialize the form
  const form = useForm({
    defaultValues: formValues
  });

  // Update form values when the external formValues change
  useEffect(() => {
    form.reset(formValues);
  }, [formValues, form]);
  
  // Update external state when form values change
  const handleValueChange = (name: string, value: any) => {
    onChange(name, value);
  };
  
  if (!hasParameters) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">No parameters required for this endpoint</p>
      </div>
    );
  }
  
  // Group parameters by location (path, query, header, body)
  const paramGroups: Record<string, typeof endpoint.parameters> = {};
  endpoint.parameters.forEach(param => {
    if (!paramGroups[param.in]) {
      paramGroups[param.in] = [];
    }
    paramGroups[param.in].push(param);
  });
  
  const renderFormField = (param: typeof endpoint.parameters[0]) => {
    const value = formValues[param.name];
    
    // Render appropriate input based on parameter type
    const renderInput = () => {
      if (param.in === 'body') {
        return (
          <Textarea 
            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value || '')}
            onChange={(e) => {
              try {
                const parsedValue = JSON.parse(e.target.value);
                handleValueChange(param.name, parsedValue);
              } catch {
                handleValueChange(param.name, e.target.value);
              }
            }}
            className="font-mono"
            rows={10}
            readOnly={readOnly}
            disabled={readOnly}
          />
        );
      }
      
      if (param.type === 'boolean') {
        return (
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => handleValueChange(param.name, checked)}
            disabled={readOnly}
          />
        );
      }
      
      if (param.type === 'array') {
        return (
          <Textarea
            value={Array.isArray(value) ? value.join('\n') : String(value || '')}
            onChange={(e) => handleValueChange(param.name, e.target.value.split('\n'))}
            placeholder="One value per line"
            rows={3}
            readOnly={readOnly}
            disabled={readOnly}
          />
        );
      }
      
      // Check if param has enum values, safely
      const paramEnum = (param as any).enum;
      if (paramEnum && Array.isArray(paramEnum)) {
        return (
          <Select
            value={String(value || '')}
            onValueChange={(val) => handleValueChange(param.name, val)}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {paramEnum.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      
      return (
        <Input
          type={param.type === 'number' || param.type === 'integer' ? 'number' : 'text'}
          value={String(value || '')}
          onChange={(e) => {
            const newValue = param.type === 'number' || param.type === 'integer'
              ? parseFloat(e.target.value)
              : e.target.value;
            handleValueChange(param.name, newValue);
          }}
          readOnly={readOnly}
          disabled={readOnly}
        />
      );
    };
    
    return (
      <div key={param.name} className="mb-4">
        <div className="flex flex-col">
          <div className="font-medium">
            {param.name}
            {param.required && <span className="text-red-500 ml-1">*</span>}
          </div>
          <div className="mt-1">
            {renderInput()}
          </div>
          {param.description && (
            <p className="text-sm text-muted-foreground mt-1">{param.description}</p>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <Form {...form}>
      <div className="space-y-6">
        {Object.entries(paramGroups).map(([group, params]) => (
          <div key={group} className="space-y-4">
            <h3 className="text-sm font-medium capitalize">{group} Parameters</h3>
            <div className="space-y-2">
              {params.map(renderFormField)}
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default EndpointForm;
