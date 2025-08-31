// Test: Default export with named export (should be invalid)
export const namedFunction = () => 'named';

export default function defaultFunction() {
  return 'default';
}