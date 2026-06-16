// Invalid: a mutable binding is exported.
// import/no-mutable-exports should flag the `export let`, since consumers
// would observe a value that can change out from under them.
// The reassignment below keeps prefer-const from masking the real issue.
export let counter = 0
counter += 1
