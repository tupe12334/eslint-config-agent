// Shared target module imported by the useless-path-segments fixtures. A
// type-only export keeps the importing fixtures free of unrelated
// type-checking noise.
export interface Thing {
  id: number
}
