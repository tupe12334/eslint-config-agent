// Fixture for @typescript-eslint/no-floating-promises.
//
// A Promise that is awaited, returned, explicitly void-ed, or handled with
// .catch must not be flagged.

async function saveRecord(id: string): Promise<void> {
  await Promise.resolve(id)
}

export async function saveAndWait(id: string): Promise<void> {
  await saveRecord(id)
}

export function saveAndReturn(id: string): Promise<void> {
  return saveRecord(id)
}

export function saveAndForget(id: string): void {
  void saveRecord(id)
}

export function saveAndCatch(id: string): void {
  saveRecord(id).catch(() => {
    // intentionally ignored for this fixture
  })
}
