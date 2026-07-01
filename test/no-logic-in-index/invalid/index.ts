// Fixture for ddd/no-logic-in-index.
//
// `index.ts` is expected to be a pure re-export barrel. Defining a real
// function here — not just forwarding another module's export — must be
// flagged: the logic ships with no dedicated spec file, since barrel files
// are exempt from the require-spec-file rule.
export function formatGreeting(name: string): string {
  return `Hello, ${name}!`
}
