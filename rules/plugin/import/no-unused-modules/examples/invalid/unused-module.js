// Invalid: This entire module is never imported anywhere
const internalData = [1, 2, 3];

export const result = internalData.map(x => x * 2);