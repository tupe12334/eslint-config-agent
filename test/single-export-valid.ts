// This file should NOT trigger import/group-exports warnings
// Single grouped export declaration is preferred

const firstFunction = () => {
  return 'first';
};

const secondFunction = () => {
  return 'second';
};

interface MyInterface {
  id: string;
}

type MyType = {
  name: string;
};

class MyClass {
  constructor() {}
}

// Single export declaration - this is the preferred style
export {
  firstFunction,
  secondFunction,
  MyInterface,
  MyType,
  MyClass,
};