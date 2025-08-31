// Test: Mixed export types (should be invalid - multiple exports)
export const namedExport = 'named';
export interface MixedInterface { id: string; }
export type MixedType = string;