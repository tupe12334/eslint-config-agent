// Invalid: an empty named import block left behind after deleting the last
// named binding. import/no-empty-named-blocks should flag the `{}`; the fix is
// to drop the braces (a bare side-effect import) or remove the line entirely.
import {} from 'fs'

export interface FileInfo {
  size: number
}
