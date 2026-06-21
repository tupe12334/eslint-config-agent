// Valid: a collapsed relative import path with no redundant `./` or `../`
// segments, so import/no-useless-path-segments stays quiet. A type-only import
// keeps the fixture free of unrelated type-checking noise.
import type { Thing } from './target'

export interface FileInfo {
  thing: Thing
}
