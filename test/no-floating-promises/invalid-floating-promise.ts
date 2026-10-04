// Fixture for @typescript-eslint/no-floating-promises.
//
// A Promise created but never awaited, returned, void-ed, or handled with
// .catch/.then is a floating promise and must be flagged: its rejection
// becomes an unhandled rejection, detached from the caller.

async function saveRecord(id: string): Promise<void> {
  await Promise.resolve(id)
}

export function triggerSave(id: string): void {
  saveRecord(id)
}
