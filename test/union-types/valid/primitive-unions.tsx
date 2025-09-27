// Valid: Primitive type unions are allowed

interface PrimitiveUnions {
  value: string | number;
  data: boolean | undefined;
  count: number | null;
  optional?: string | number;
  callback: (() => void) | ((value: string) => void) | null;
}

interface PrimitiveType {
  mixed: string | number | boolean;
  element: HTMLElement | SVGElement;
}

export { PrimitiveUnions, PrimitiveType };