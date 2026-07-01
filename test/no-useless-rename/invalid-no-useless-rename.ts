// Invalid fixture for `no-useless-rename`.
//
// Renaming an import, an export, or a destructured binding to the exact name
// it already has adds an `as`/`:` clause that looks like a transformation but
// changes nothing — pure punctuation noise a reader must double-check for no
// reason. A single export keeps the fixture free of unrelated
// single-export/single-export noise so only the rename violations fire.

import { getValue as getValue } from './value'

const record = { count: getValue() }
const { count: count } = record

export { count as count }
