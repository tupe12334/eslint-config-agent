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
  // Forbid fragments that wrap a single child: `<><MyComponent /></>` adds DOM
  // overhead and a return-type mismatch (`React.ReactElement` vs `JSX.Element`)
  // without buying anything. It is exactly the kind of dead-weight an AI
  // assistant emits when scaffolding a component. `allowExpressions: false`
  // also covers `<>{value}</>` — if you need a fragment solely for a JSX
  // expression, wrap it in a parent instead. The rule is auto-fixable, so
  // `eslint --fix` rewrites `<><X /></>` to `<X />` with zero manual work.
  // oss-il already enables this by hand on top of the base config; promoting
  // it here removes the per-repo copy-paste.
  'react/jsx-no-useless-fragment': ['error', { allowExpressions: false }],
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
  // Forbid the `dangerouslySetInnerHTML` prop. Setting inner HTML directly from
  // a string bypasses React's XSS defenses: any server-sourced or user-supplied
  // content rendered this way can execute arbitrary scripts in the browser.
  // `dangerouslySetInnerHTML` is intentionally verbose — its name is a warning —
  // but AI assistants still reach for it when they need to inject a server HTML
  // fragment or render a rich-text field, without thinking through whether the
  // content is safe. The only legitimate uses (known-safe static markup, a
  // sanitized string from a DOMPurify-style pass) should be reviewed explicitly;
  // the rule forces that review by making every usage a lint error, which the
  // engineer must suppress with an `eslint-disable` comment that makes the
  // intentional decision visible in code review. The rule is not auto-fixable,
  // so each suppression is a deliberate act.
  'react/no-danger': 'error',
  // Forbid a freshly-constructed value as the `value` of a Context Provider:
  // `<Ctx.Provider value={{ user, setUser }}>` or `value={[state, dispatch]}`
  // or `value={() => ...}`. The object/array/function literal is rebuilt on
  // every render of the providing component, so its identity changes every time
  // even when the data inside is unchanged. React compares context values by
  // reference, so a new reference forces *every* consumer of that context to
  // re-render — including ones that `React.memo`/`useMemo` were added precisely
  // to protect. The result is a silent, whole-subtree performance bug: the app
  // is correct but does far more work than it should, and the cause (an inline
  // literal three components up) is invisible at the consumer. The fix states
  // the intent explicitly — hoist the value into a `useMemo`/`useCallback` (or a
  // stable ref) so the reference only changes when the data does. An inline
  // `value={{ ... }}` is exactly the shortcut an AI assistant emits when wiring
  // up a provider, so it sits on the same correctness/perf-not-style bar that
  // turns on `jsx-no-leaked-render` and `no-array-index-key` above while leaving
  // the cosmetic react rules off. Like the other react rules it only applies to
  // `.jsx`/`.tsx` files, so non-React TypeScript packages are unaffected. This
  // is why a downstream repo (`oss-il`) already re-adds it by hand on top of the
  // base config.
  'react/jsx-no-constructed-context-values': 'error',
}
