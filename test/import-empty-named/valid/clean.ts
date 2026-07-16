// Valid: a named import with at least one binding. No empty `{}` block, so
// import/no-empty-named-blocks should stay quiet. A type-only import keeps the
// fixture free of unrelated type-checking noise.
import type { Stats } from 'node:fs'

export interface FileInfo {
  stats: Stats
}
