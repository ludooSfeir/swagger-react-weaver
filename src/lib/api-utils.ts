
import { toast } from "sonner";
import { Endpoint, getBaseUrl, getDefaultValueForType } from "./swagger";

export async function executeApiRequest(endpoint: Endpoint, formData: any) {
  try {
    const requestData = buildRequestData(endpoint, formData);
    const url = buildUrl(endpoint, requestData);
    const options = buildRequestOptions(endpoint, requestData);
    
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType?.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    return {
      ok: response.ok,
      status: response.status,
      data: responseData,
    };
  } catch (error) {
    console.error('API request failed:', error);
    toast.error('API request failed', {
      description: error instanceof Error ? error.message : 'Unknown error',
    });
    
    return {
      ok: false,
      status: 0,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function buildRequestData(endpoint: Endpoint, formData: any) {
  const requestData: Record<string, any> = {
    path: {},
    query: {},
    body: null,
    header: {},
    formData: {}
  };
  
  endpoint.parameters.forEach(param => {
    if (param.in && formData[param.name] !== undefined) {
      if (param.in === 'body' && param.schema) {
        requestData.body = formData[param.name];
      } else if (param.in === 'formData') {
        requestData.formData[param.name] = formData[param.name];
      } else {
        requestData[param.in][param.name] = formData[param.name];
      }
    }
  });
  
  return requestData;
}

function buildUrl(endpoint: Endpoint, requestData: Record<string, any>) {
  const baseUrl = getBaseUrl();
  
  // Replace path parameters
  let path = endpoint.path;
  Object.entries(requestData.path).forEach(([key, value]) => {
    path = path.replace(`{${key}}`, encodeURIComponent(value as string));
  });
  
  // Add query parameters
  const queryParams = new URLSearchParams();
  Object.entries(requestData.query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      (value as any[]).forEach(v => queryParams.append(key, v));
    } else {
      queryParams.append(key, value as string);
    }
  });
  
  const queryString = queryParams.toString();
  
  return `${baseUrl}${path}${queryString ? `?${queryString}` : ''}`;
}

function buildRequestOptions(endpoint: Endpoint, requestData: Record<string, any>) {
  const options: RequestInit = {
    method: endpoint.method.toUpperCase(),
    headers: {
      ...requestData.header
    },
  };
  
  if (requestData.body) {
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json'
    };
    options.body = JSON.stringify(requestData.body);
  } else if (Object.keys(requestData.formData).length > 0) {
    const formData = new FormData();
    Object.entries(requestData.formData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    options.body = formData;
  }
  
  return options;
}

export function generateInitialFormValues(endpoint: Endpoint) {
  const initialValues: Record<string, any> = {};
  
  endpoint.parameters.forEach(param => {
    if (param.in === 'body' && param.schema) {
      initialValues[param.name] = {};
    } else if (param.type) {
      initialValues[param.name] = getDefaultValueForType(param.type);
    } else {
      initialValues[param.name] = null;
    }
  });
  
  return initialValues;
}
