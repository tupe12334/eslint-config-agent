// Fixture for ddd/no-logic-in-index.
//
// A pure re-export barrel must not be flagged — it forwards `./greeting`'s
// public surface without defining any logic of its own.
export { formatGreeting } from './greeting'
