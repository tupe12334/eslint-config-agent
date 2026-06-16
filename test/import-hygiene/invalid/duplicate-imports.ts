// Invalid: the same module is imported in two separate statements.
// import/no-duplicates should flag this and ask for a single merged import.
// Type-only imports keep the fixture focused on the duplication, free of
// unrelated type-checking noise.
import type { Stats } from 'fs'
import type { BigIntStats } from 'fs'

export interface FileInfo {
  stats: Stats
  big: BigIntStats
}
