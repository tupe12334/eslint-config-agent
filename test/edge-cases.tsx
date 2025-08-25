import React from 'react';

// Edge cases and boundary testing

// Test complex JSX structures
function ComplexJSXComponent() {
  const items = ['a', 'b', 'c'];

  return (
    <div>
      {/* Self-closing components (react/self-closing-comp is off) */}
      <input type="text"></input>
      <br></br>

      {/* Object curly newline (object-curly-newline is off) */}
      <div style={{
        color: 'red', background: 'blue', fontSize: '14px', margin: '10px'
      }}>
        Multi-prop div
      </div>

      {/* JSX props spreading (react/jsx-props-no-spreading is off) */}
      <SomeComponent {...{ name: 'test', value: 123 }} />

      {/* Button without type (react/button-has-type is off) */}
      <button onClick={() => console.log('clicked')}>Click me</button>

      {/* Multiple expressions per line (react/jsx-one-expression-per-line is off) */}
      <div>{items[0]} {items[1]} {items[2]}</div>

      {/* Unknown props (react/no-unknown-property is off) */}
      <div customProp="value" nonStandard={true}>Custom props</div>

      {/* Target blank without rel (react/jsx-no-target-blank is off) */}
      <a href="https://example.com" target="_blank">External link</a>

      {/* Fragments (react/jsx-no-useless-fragment is off) */}
      <React.Fragment>
        <span>Fragment content</span>
      </React.Fragment>

      {/* No React in scope (react/react-in-jsx-scope is off) */}
      <div>This works without explicit React import in modern setups</div>
    </div>
  );
}

// Component without defaultProps (react/require-default-props is off)
interface Props {
  name?: string;
  count?: number;
}

function ComponentWithoutDefaults({ name, count }: Props) {
  return <div>Name: {name}, Count: {count}</div>;
}

// Function component definition styles (react/function-component-definition is off)
const ArrowComponent = ({ title }: { title: string }) => {
  return <h1>{title}</h1>;
};

function RegularFunction({ subtitle }: { subtitle: string }) {
  return <h2>{subtitle}</h2>;
}

// Complex nested structures
function NestedComponent() {
  return (
    <div>
      <div>
        <div>
          <div>
            <span>Deeply nested</span>
          </div>
        </div>
      </div>
      {/* Multiline JSX (react/jsx-wrap-multilines is off) */}
      {true && <div>
        Conditional content
        that spans multiple lines
      </div>}
    </div>
  );
}

// Test destructuring assignment (react/destructuring-assignment is off)
function NoDestructuring(props: { user: { name: string; email: string } }) {
  return (
    <div>
      <p>Name: {props.user.name}</p>
      <p>Email: {props.user.email}</p>
    </div>
  );
}

// Test shadow variables (no-shadow is off)
function ShadowTest() {
  const name = 'outer';

  function inner() {
    const name = 'inner'; // This shadows the outer name
    return name;
  }

  return { outer: name, inner: inner() };
}

// Test continue statement (no-continue is off)
function ContinueTest() {
  const results = [];

  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
      continue; // This should be allowed
    }
    results.push(i);
  }

  return results;
}

// Test various function styles and complexity (complexity is off)
function ComplexFunction(input: number): string {
  if (input < 0) {
    if (input < -10) {
      if (input < -100) {
        return 'very negative';
      } else {
        return 'quite negative';
      }
    } else {
      return 'negative';
    }
  } else if (input === 0) {
    return 'zero';
  } else {
    if (input > 100) {
      if (input > 1000) {
        return 'very positive';
      } else {
        return 'quite positive';
      }
    } else {
      return 'positive';
    }
  }
}

// Test semicolons (semi is off)
const noSemicolon = 'this line has no semicolon'
const withSemicolon = 'this line has a semicolon';

// Test quotes (quotes is off)
const singleQuotes = 'single quotes';
const doubleQuotes = "double quotes";
const backticks = `template literals`;

export {
  ComplexJSXComponent,
  ComponentWithoutDefaults,
  ArrowComponent,
  RegularFunction,
  NestedComponent,
  NoDestructuring,
  ShadowTest,
  ContinueTest,
  ComplexFunction,
  noSemicolon,
  withSemicolon,
  singleQuotes,
  doubleQuotes,
  backticks
};

// Helper component for testing
function SomeComponent(props: any) {
  return <div>{JSON.stringify(props)}</div>;
}