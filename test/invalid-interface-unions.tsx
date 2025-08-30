// Test file for invalid interface union types - should trigger union type warnings/errors

interface InvalidInterface {
  // These literal unions should be RESTRICTED
  status: 'pending' | 'success' | 'error';
  mode: 'light' | 'dark';
  priority: 'low' | 'medium' | 'high';
  theme: 'default' | 'minimal' | 'colorful';
}

class InvalidClass {
  // Class properties with literal unions should be RESTRICTED
  status: 'active' | 'inactive' | 'pending' = 'active';
  visibility: 'public' | 'private' = 'public';

  // Mixed literal and type unions should be RESTRICTED (because of literals)
  mixed: 'none' | number = 'none';

  constructor() {
    this.status = 'active';
  }
}

// These should be RESTRICTED (function parameters with unions)
function invalidFunction(param: string | number) {
  return param;
}

function invalidLiteralFunction(mode: 'light' | 'dark') {
  return mode;
}

// Type aliases with union parameters should be RESTRICTED
type InvalidType = (param: string | number) => void;
type InvalidLiteralType = (mode: 'on' | 'off') => boolean;

export { InvalidInterface, InvalidClass };