// Fixture for @typescript-eslint/no-unnecessary-condition.
//
// `value` is genuinely nullable, so the guard reflects a real runtime
// possibility and must not be flagged.

interface Config {
  name: string
}

type MaybeConfig = Config | null

export function describe(value: MaybeConfig): string {
  if (value) {
    return value.name
  }
  return 'unknown'
}
