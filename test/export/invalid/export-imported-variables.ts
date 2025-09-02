// Invalid: Exporting imported variables is not allowed
import { helper } from './helper';

// Should trigger error - exporting imported variable
export const myHelper = helper;