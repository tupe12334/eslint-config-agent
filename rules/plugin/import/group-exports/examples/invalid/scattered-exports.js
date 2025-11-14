// Invalid: Named exports scattered across multiple statements
const config = { api: 'v1' }
const utils = { format: () => {} }

export { config }

const helpers = { validate: () => {} }

export { utils }
export { helpers }
