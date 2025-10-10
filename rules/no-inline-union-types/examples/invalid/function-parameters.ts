// Invalid: Function parameters with inline union types

// ❌ Regular function with inline union
function processRequest(method: 'GET' | 'POST' | 'PUT') {
  return method;
}

// ❌ Arrow function with inline union
const handleEvent = (type: 'click' | 'hover' | 'focus') => {
  console.log(type);
};

// ❌ Async function with inline union
async function fetchData(format: 'json' | 'xml' | 'csv') {
  return format;
}

// ❌ Method with inline union parameter
class ApiClient {
  request(method: 'GET' | 'POST', endpoint: string) {
    return `${method} ${endpoint}`;
  }
}
