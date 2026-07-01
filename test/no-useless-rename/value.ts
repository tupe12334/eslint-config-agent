// Shared helper module imported by the no-useless-rename fixtures. A typed
// function export keeps the importing fixtures free of unrelated
// type-checking noise (an unresolved import would type as `any`/`error` and
// trip @typescript-eslint/no-unsafe-return where the value is used).
export const getValue = (): number => 1
