# ESLint Rules Configuration

This directory contains custom rule configurations and their tests using ESLint's RuleTester.

## Structure

Each rule has its own directory with:
- `index.js` - The rule configuration (severity and options)
- `[rule-name].spec.js` - RuleTester test cases

## Available Rules

### no-trailing-spaces
- **Severity**: error
- **Description**: Disallows trailing whitespace at the end of lines
- **Options**: 
  - `skipBlankLines: false` - Check empty lines for trailing spaces
  - `ignoreComments: false` - Check comments for trailing spaces

## Testing

Run individual rule tests:
```bash
cd rules/no-trailing-spaces
node no-trailing-spaces.spec.js
```

## Adding New Rules

1. Create a new directory: `rules/[rule-name]/`
2. Add `index.js` with the rule configuration
3. Add `[rule-name].spec.js` with RuleTester tests
4. Import the configuration in the main `index.js` file

Example structure:
```javascript
// rules/[rule-name]/index.js
export const rule = "error"; // or "warn"
export const options = { /* rule options */ };
export const [ruleName]Config = [rule, options];
export default [ruleName]Config;
```