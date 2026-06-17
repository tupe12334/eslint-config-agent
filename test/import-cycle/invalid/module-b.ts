// Invalid: the other half of the module-a <-> module-b cycle.
// import/no-cycle should flag the back-reference that closes the loop.
import { moduleA } from './module-a'

export const moduleB = (): number => moduleA() + 1
