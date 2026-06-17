// Invalid: a module that imports itself. import/no-self-import should flag the
// side-effect self import below, which is always a mistake.
import './self-import'

export const selfValue = (): number => 1
