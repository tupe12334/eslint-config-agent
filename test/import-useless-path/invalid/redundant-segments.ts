// Invalid: a relative import path carrying a redundant `./` segment. The path
// `./foo/../valid/target` collapses to `./valid/target`, so the import reads as
// if it points somewhere other than where it resolves.
// import/no-useless-path-segments should flag it; the auto-fix rewrites the
// path to its collapsed form.
import type { Thing } from './foo/../valid/target'

export interface FileInfo {
  thing: Thing
}
