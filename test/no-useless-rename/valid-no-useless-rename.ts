// Valid fixture for `no-useless-rename`.
//
// Renaming an import, an export, or a destructured binding to a *different*
// name documents an intentional alias and must not be flagged. A single
// export keeps the fixture free of unrelated single-export/single-export
// noise so only the rename rule is under test.

import { getValue as fetchValue } from './value'

const record = { count: fetchValue() }
const { count: total } = record

export { total as grandTotal }
