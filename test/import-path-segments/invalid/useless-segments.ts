// Invalid: the relative path walks into a directory and immediately back out
// (`foo/..`), so it resolves to the same module as the shorter `../valid/target`.
// import/no-useless-path-segments should flag the redundant segment; the fix is
// to collapse it to the shortest equivalent path. A type-only import keeps the
// fixture focused on the path spelling, free of unrelated type-checking noise.
import type { Marker } from '../valid/foo/../target'

export interface Tagged {
  marker: Marker
}
