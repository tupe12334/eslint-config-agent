// Valid: the relative path is already in its shortest form, so
// import/no-useless-path-segments should stay quiet. A type-only import keeps
// the fixture free of unrelated type-checking noise.
import type { Marker } from './target'

export interface Tagged {
  marker: Marker
}
