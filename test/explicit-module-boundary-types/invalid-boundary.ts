// The exported function below leaves its return type to inference, so the
// public boundary of this module is implicit.
// explicit-module-boundary-types must flag it.
export const shout = (text: string) => text.toUpperCase()
