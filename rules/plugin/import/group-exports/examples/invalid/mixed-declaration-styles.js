// Invalid: Mix of direct exports and separate export statements
export const first = 'direct export';

const second = 'separate export';
const third = 'another separate export';

export { second };
export { third };