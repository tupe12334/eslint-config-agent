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
}
