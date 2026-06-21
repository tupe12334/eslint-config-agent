export const reactRules = {
  'react/self-closing-comp': 'off',
  'react/destructuring-assignment': 'off',
  'react/jsx-props-no-spreading': 'off',
  'react/button-has-type': 'off',
  'react/react-in-jsx-scope': 'off',
  'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
  'react/function-component-definition': 'off',
  'react/jsx-one-expression-per-line': 'off',
  'react/no-unknown-property': 'off',
  'react/jsx-no-target-blank': 'off',
  'react/require-default-props': 'off',
  'react/jsx-wrap-multilines': 'off',
  'react/jsx-closing-bracket-location': 'off',
  'react/jsx-no-useless-fragment': 'off',
  // Guard against React's "leaked render" bug: a short-circuit like
  // `{count && <List />}` renders the literal `0` (or `NaN`) when the left
  // operand is a falsy *non-boolean*, and `{name && <h1>{name}</h1>}` renders
  // an empty string the same way. React only skips rendering for `false`,
  // `null` and `undefined`, so any other falsy value leaks straight into the
  // DOM as visible text. That is a real rendering bug the type checker cannot
  // catch (the JSX is perfectly typed) and exactly the shortcut AI assistants
  // emit when conditionally rendering a list or label. Unlike the stylistic
  // react rules turned off above, this is a correctness check, so it is turned
  // on. `validStrategies: ['ternary', 'coerce']` forces the unambiguous form —
  // an explicit `cond ? <X /> : null` or a boolean coercion `!!cond && <X />`
  // — instead of the bare `&&` that leaks. The rule is auto-fixable, so
  // consumers can adopt it with `eslint --fix`.
  'react/jsx-no-leaked-render': [
    'error',
    { validStrategies: ['ternary', 'coerce'] },
  ],
  // Forbid using an array index as a React `key` (`items.map((item, i) => <Row
  // key={i} />)`). A key is React's identity for a list child across renders;
  // when it is the position rather than something stable about the item, React
  // maps the wrong previous element onto the wrong new one as soon as the list
  // is reordered, filtered, or has an item inserted/removed at the front or
  // middle. The visible result is a class of silent UI bugs that no type check
  // can catch: text typed into one input jumps to another row, the wrong item
  // animates, a checkbox's checked state sticks to the wrong record, and
  // uncontrolled component state generally "smears" across siblings. The fix is
  // to key by a stable, item-specific value (an id, a slug, a content hash),
  // which states the intended identity explicitly. `key={index}` is exactly the
  // shortcut an AI assistant reaches for when the item has no obvious id, so it
  // is squarely in this config's bug-prevention, explicit-over-clever stance —
  // the same correctness-not-style bar that turns on `jsx-no-leaked-render`
  // above while leaving the cosmetic react rules off. Like the other react
  // rules it only applies to `.jsx`/`.tsx` files, so non-React TypeScript
  // packages are unaffected. This is why a downstream repo (`oss-il`) already
  // re-adds it by hand on top of the base config.
  'react/no-array-index-key': 'error',
  // Forbid declaring a component inside another component's render body
  // (`const Row = () => <li/>; return <ul>{items.map(() => <Row/>)}</ul>`).
  // Because the inner component is a brand-new function identity on every
  // render of the parent, React cannot reconcile it against the previous
  // render: it unmounts the old subtree and mounts a fresh one each time. The
  // visible result is a class of silent bugs no type check can catch — the
  // nested component's local state and refs reset on every parent render, its
  // effects re-run, inputs lose focus mid-keystroke, and the remount churn
  // costs real performance. The fix is to lift the component to module scope
  // (or pass data via props) so its identity is stable across renders. Defining
  // a component inline is exactly the shortcut an AI assistant reaches for when
  // a small piece of UI is only used once, so it sits squarely in this config's
  // bug-prevention, correctness-not-style stance — the same bar that turns on
  // `jsx-no-leaked-render` and `no-array-index-key` above while leaving the
  // cosmetic react rules off. Like the other react rules it only applies to
  // `.jsx`/`.tsx` files, so non-React TypeScript packages are unaffected.
  'react/no-unstable-nested-components': 'error',
}
