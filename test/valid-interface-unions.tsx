// Test file for valid interface union types - should have no errors on union rules

interface ValidInterface {
  // These union types of actual types should be ALLOWED
  value: string | number;
  data: boolean | undefined;
  count: number | null;
  optional?: string | number;
  callback: (() => void) | ((value: string) => void) | null;

  // Complex type unions should be allowed
  response: Response | Error;
  element: HTMLElement | SVGElement;
  mixed: string | number | boolean;
}

// Type aliases with primitive unions should be allowed
type ValidType = {
  field: string | number;
  optional?: boolean | undefined;
};

export { ValidInterface, ValidType };
