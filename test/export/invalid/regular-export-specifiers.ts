// Invalid: regular export specifiers without from clause

type MyType = string;

// This should trigger the new rule
export { MyType };