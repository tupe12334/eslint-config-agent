// Valid: Functions using named union types

type HttpMethod = 'GET' | 'POST' | 'PUT';
type EventType = 'click' | 'hover' | 'focus';
type DataFormat = 'json' | 'xml' | 'csv';

// ✅ Regular function with named type
function processRequest(method: HttpMethod) {
  return method;
}

// ✅ Arrow function with named type
const handleEvent = (type: EventType) => {
  console.log(type);
};

// ✅ Async function with named type
async function fetchData(format: DataFormat) {
  return format;
}

// ✅ Method with named type parameter
class ApiClient {
  request(method: HttpMethod, endpoint: string) {
    return `${method} ${endpoint}`;
  }
}
