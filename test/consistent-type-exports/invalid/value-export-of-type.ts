// Fixture for `@typescript-eslint/consistent-type-exports`.
//
// `Pixel` is a type-only declaration. Re-exporting it through a *value* export
// statement (`export { Pixel }`) leaves a runtime export edge for a name that
// is erased at compile time — bundlers keep the module alive and the re-export
// breaks under `verbatimModuleSyntax` / `isolatedModules`. The rule must flag
// the value export and steer the author to `export type { Pixel }` (the
// export-side mirror of the `consistent-type-imports` guarantee).

interface Pixel {
  x: number
  y: number
}

export { Pixel }
