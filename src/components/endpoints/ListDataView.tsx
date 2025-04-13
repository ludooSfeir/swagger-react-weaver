
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";

interface ListDataViewProps {
  response: {
    ok: boolean;
    status: number;
    data: any;
    error?: string;
  };
  entityName: string;
}

const ListDataView: React.FC<ListDataViewProps> = ({ response, entityName }) => {
  if (!response.ok || response.error) {
    return (
      <Card className="border-destructive">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-destructive flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            Error fetching {entityName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {response.error || `Status code: ${response.status}`}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Handle different response data structures
  let items = response.data;
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items);
    } catch (e) {
      items = [];
    }
  }

  // Check if data is an object with a results/items/data field (common API patterns)
  if (items && typeof items === 'object' && !Array.isArray(items)) {
    if (items.results) items = items.results;
    else if (items.items) items = items.items;
    else if (items.data) items = items.data;
    else if (Object.keys(items).length === 1 && Array.isArray(Object.values(items)[0])) {
      // If there's only one key and its value is an array, use that
      items = Object.values(items)[0];
    }
  }

  // If not an array, convert to array of single item
  if (!Array.isArray(items)) {
    items = [items];
  }

  // If array is empty
  if (items.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{entityName} list</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-muted-foreground">No {entityName} found</p>
        </CardContent>
      </Card>
    );
  }

  // Get columns from the first item
  const firstItem = items[0];
  let columns = Object.keys(firstItem);
  
  // Limit to max 6 columns for readability
  if (columns.length > 6) {
    columns = columns.slice(0, 6);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{entityName} list</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="capitalize">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={`${index}-${column}`}>
                      {renderCellValue(item[column])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to render cell values based on their type
function renderCellValue(value: any): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value).substring(0, 50) + (JSON.stringify(value).length > 50 ? '...' : '');
  }
  
  return String(value);
}

export default ListDataView;
