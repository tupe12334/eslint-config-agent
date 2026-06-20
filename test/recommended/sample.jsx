// Idiomatic React/Preact + Tailwind that the strict default config rejects
// but the relaxed `recommended` preset accepts. The `<div>` carries only
// Tailwind utility classes, which `jsx-classname/require-classname`
// (`ignoreTailwind: true`) treats as a missing semantic className.
export const Card = () => <div className="flex gap-2" />
