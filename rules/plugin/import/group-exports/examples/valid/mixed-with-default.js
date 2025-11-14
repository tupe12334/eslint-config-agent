// Valid: Default export with grouped named exports
const mainConfig = { theme: 'dark' }
const helper1 = () => 'helper'
const helper2 = () => 'another helper'

export default mainConfig
export { helper1, helper2 }
