// Valid: a one-directional import of a leaf module. Because the dependency
// graph stays acyclic, neither import/no-cycle nor import/no-self-import fires.
import { leafValue } from './leaf'

export const usesLeaf = (): number => leafValue() + 1
