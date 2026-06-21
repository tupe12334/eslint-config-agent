// Fixture for `@typescript-eslint/method-signature-style`.
//
// `handle` below is declared with the method-shorthand syntax
// (`handle(...): void`). That form is exempted from `strictFunctionTypes` and
// checked bivariantly — an unsound hole the property style
// (`handle: (...) => void`) does not have. The rule must flag the shorthand so
// it is rewritten to the sound property form.

/**
 * Handles an application event.
 */
export interface EventHandler {
  handle(event: string): void
}
