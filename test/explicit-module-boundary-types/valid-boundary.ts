// The exported function below annotates both its parameter and its return
// type, so the public boundary of this module is explicit and stable.
export const shout = (text: string): string => text.toUpperCase()
