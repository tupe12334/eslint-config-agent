// Valid: a single merged type-only import and an immutable export.
// Neither import/no-duplicates nor import/no-mutable-exports should fire.
import type { Stats, BigIntStats } from 'fs'

export interface FileInfo {
  stats: Stats
  big: BigIntStats
}
