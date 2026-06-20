import type { Linter } from 'eslint'

import config from '../../index.js'
import ddd from '../../exports/ddd.js'
import incremental from '../../exports/incremental.js'
import recommended from '../../exports/recommended.js'
import recommendedIncremental from '../../exports/recommended-incremental.js'

/**
 * Asserts that every shipped entry point types as a flat-config array
 * (`Linter.Config[]`). If a `.d.ts` drifts from that shape, `pnpm test:types`
 * fails to compile.
 */
const assertFlatConfig = (value: Linter.Config[]): Linter.Config[] => value

assertFlatConfig(config)
assertFlatConfig(ddd)
assertFlatConfig(incremental)
assertFlatConfig(recommended)
assertFlatConfig(recommendedIncremental)
