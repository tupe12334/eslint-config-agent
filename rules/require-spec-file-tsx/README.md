# require-spec-file-tsx

Require a sibling spec file next to every `.tsx`/`.jsx` source file that
contains logic (a component, hook, or any function/class with a body).

## Why

The shared config already enforces `ddd/require-spec-file`, but the upstream
[`eslint-plugin-ddd`](https://www.npmjs.com/package/eslint-plugin-ddd) rule only
inspects `.js`/`.ts` files — it computes its target extension as `.js`/`.ts` and
bails out on anything else. That silently exempts `.tsx`/`.jsx` files, i.e. the
React/Preact components this config is primarily built for. The package
advertises "Requires spec files for **all** source files", yet components — the
files most worth testing — were never actually covered.

`custom/require-spec-file-tsx` closes that gap for the JSX extensions, leaving
`.js`/`.ts` to the `ddd` plugin so the two halves behave consistently.

## What it checks

A `.tsx`/`.jsx` file passes when a sibling `<name>.spec.<ext>` exists in the same
directory:

```
components/
├── Button.tsx        # Requires: Button.spec.tsx
├── Button.spec.tsx   # ✅ present
└── index.tsx         # excluded (index/barrel file)
```

As with `ddd/require-spec-file`, only the `.spec.*` name satisfies the
requirement. A `.test.*` sibling is itself skipped from needing a spec, but it
does **not** satisfy the requirement for the source file.

## Excluded by default

- `index.tsx` / `index.jsx` (barrel files)
- `*.stories.tsx` / `*.stories.jsx`
- `.d.ts` declaration files
- Error/exception files — `*-error.{tsx,jsx}`, `*.error.{tsx,jsx}`, anything
  under `errors/` or `exceptions/` (mirrors the `ddd/require-spec-file`
  exemptions for `.ts`/`.js`)
- Files with no logic (e.g. pure re-export barrels)
- `.spec.*` / `.test.*` files themselves

## Options

| Option            | Type       | Default                                                                                                                                                       | Description                                         |
| ----------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `excludePatterns` | `string[]` | `['**/index.tsx', '**/index.jsx', '**/*.stories.{tsx,jsx}', '**/*.d.ts', '**/*-error.{tsx,jsx}', '**/*.error.{tsx,jsx}', '**/errors/**', '**/exceptions/**']` | Glob patterns to exclude from the spec requirement. |

```js
'custom/require-spec-file-tsx': [
  'error',
  { excludePatterns: ['**/index.tsx', '**/*.stories.{tsx,jsx}'] },
]
```
