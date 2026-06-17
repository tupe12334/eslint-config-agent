// Invalid: module-a imports module-b, which imports module-a back.
// import/no-cycle should flag this circular dependency. The arrow-function
// exports keep the fixture free of jsdoc/single-export noise so only the
// cycle rule fires.
import { moduleB } from './module-b'

export const moduleA = (): number => moduleB() + 1
