// Method-shorthand signatures are checked bivariantly (unsound) and must be
// rewritten to the property style. method-signature-style must flag each one.

export interface Handler {
  handle(event: string): void
  transform(input: number): number
}
