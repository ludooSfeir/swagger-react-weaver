
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Endpoint } from "@/lib/swagger";
import { Switch } from "@/components/ui/switch";

interface EndpointFormProps {
  endpoint: Endpoint;
  formValues: Record<string, any>;
  onChange: (name: string, value: any) => void;
}

const EndpointForm = ({ endpoint, formValues, onChange }: EndpointFormProps) => {
  const hasParameters = endpoint.parameters && endpoint.parameters.length > 0;
  
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
                onChange(param.name, parsedValue);
              } catch {
                onChange(param.name, e.target.value);
              }
            }}
            className="font-mono"
            rows={10}
          />
        );
      }
      
      if (param.type === 'boolean') {
        return (
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) => onChange(param.name, checked)}
          />
        );
      }
      
      if (param.type === 'array') {
        return (
          <Textarea
            value={Array.isArray(value) ? value.join('\n') : String(value || '')}
            onChange={(e) => onChange(param.name, e.target.value.split('\n'))}
            placeholder="One value per line"
            rows={3}
          />
        );
      }
      
      if (param.enum) {
        return (
          <Select
            value={String(value || '')}
            onValueChange={(val) => onChange(param.name, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {param.enum.map((option) => (
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
            onChange(param.name, newValue);
          }}
        />
      );
    };
    
    return (
      <FormField
        key={param.name}
        name={param.name}
        render={() => (
          <FormItem className="mb-4">
            <FormLabel>
              {param.name}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>{renderInput()}</FormControl>
            {param.description && (
              <FormDescription>{param.description}</FormDescription>
            )}
          </FormItem>
        )}
      />
    );
  };
  
  return (
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
  );
};

export default EndpointForm;
