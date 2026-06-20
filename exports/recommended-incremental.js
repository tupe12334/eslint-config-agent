/**
 * Recommended + incremental (relaxed, warn-level) preset.
 *
 * The package already ships two adoption on-ramps, but each only solves half of
 * what an existing codebase hits on the first lint run:
 *
 *   - `recommended` turns the most divisive rules **off** (spec files, single
 *     export, custom `error/*`, optional chaining / nullish-coalescing bans,
 *     and so on) — but every remaining rule still reports as an **error**, so a
 *     real backlog still fails CI on the first run.
 *   - `incremental` keeps **every** rule reporting but downgrades them all to
 *     **warnings** — so CI stays green, yet the divisive rules keep firing as a
 *     wall of warnings on idiomatic TypeScript and React/Preact + Tailwind code.
 *
 * The gentlest possible on-ramp is the combination of the two: relax the
 * divisive rules entirely *and* downgrade everything else to a warning. That is
 * exactly this preset — the `recommended` config with every surviving
 * error-level rule rewritten to `warn`:
 *
 * ```js
 * import recommendedIncremental from 'eslint-config-agent/recommended-incremental'
 *
 * export default recommendedIncremental
 * ```
 *
 * `eslint` exits `0`, so `pnpm lint` (and CI) stays green, the noisiest rules
 * are silent, and the remaining quality rules show up as warnings you can burn
 * down before tightening back up.
 *
 * To enforce a rule as a hard error before the rest of the backlog is cleared,
 * append your own override layer, which wins over the warned defaults:
 *
 * ```js
 * import recommendedIncremental from 'eslint-config-agent/recommended-incremental'
 *
 * export default [
 *   ...recommendedIncremental,
 *   { rules: { eqeqeq: ['error', 'always'] } },
 * ]
 * ```
 */

import recommended from './recommended.js'
import { toWarnings } from './to-warnings.js'

export default recommended.map(toWarnings)
