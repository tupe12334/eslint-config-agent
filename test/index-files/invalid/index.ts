// Invalid: Index file with default re-export as named

export { Component1 } from './component1';
export { Component2 } from './component2';
export type { MyType } from './types';
export { default as MainComponent } from './main';