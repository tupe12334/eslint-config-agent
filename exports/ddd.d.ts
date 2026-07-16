import type { Linter } from 'eslint'

/**
 * DDD preset. The DDD rules (`require-spec-file`) now ship in the base config,
 * so this entry point is equivalent to the default `eslint-config-agent`
 * export and is kept for backward compatibility.
 */
declare const config: Linter.Config[]

export default config
