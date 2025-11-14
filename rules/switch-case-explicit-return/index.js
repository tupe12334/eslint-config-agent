/**
 * Switch Case Explicit Return Rule
 *
 * Enforces that return statements in switch cases must provide an explicit return value.
 * This rule prevents empty return statements (return;) in switch cases to ensure
 * all return paths have explicit values.
 */

export const switchCaseExplicitReturnConfigs = [
  {
    selector: 'SwitchStatement > SwitchCase > ReturnStatement[argument=null]',
    message:
      'Switch case functions must provide an explicit return value. Default return values are not allowed.',
  },
  {
    selector:
      'SwitchStatement > SwitchCase > BlockStatement > ReturnStatement[argument=null]',
    message:
      'Switch case functions must provide an explicit return value. Default return values are not allowed.',
  },
]
