/**
 * ESLint rule to require className attribute on HTML elements in JSX
 *
 * This rule enforces that all HTML elements in JSX must have a className attribute.
 * It excludes React components (starting with capital letters) and fragments.
 *
 * Examples:
 * - ❌ <div>Content</div>
 * - ✅ <div className="container">Content</div>
 * - ✅ <MyComponent>Content</MyComponent> (ignored - React component)
 * - ✅ <Fragment>Content</Fragment> (ignored - fragment)
 * - ✅ <React.Fragment>Content</React.Fragment> (ignored - React fragment)
 * - ✅ <React.StrictMode>Content</React.StrictMode> (ignored - React component)
 */

const jsxClassNameRequiredRule = {
  meta: {
    type: "layout",
    docs: {
      description: "Require className attribute on HTML elements in JSX",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: null,
    schema: [],
    messages: {
      missingClassName: "HTML elements must have a className attribute.",
    },
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        // Skip if this is a React component (starts with capital letter)
        if (node.name.type === 'JSXIdentifier' && /^[A-Z]/.test(node.name.name)) {
          return;
        }

        // Skip if this is Fragment
        if (node.name.type === 'JSXIdentifier' && node.name.name === 'Fragment') {
          return;
        }

        // Skip if this is React.Something (like React.Fragment, React.StrictMode, etc.)
        if (node.name.type === 'JSXMemberExpression' &&
            node.name.object.name === 'React' &&
            /^[A-Z]/.test(node.name.property.name)) {
          return;
        }

        // Check if element has className attribute
        const hasClassName = node.attributes.some(attr =>
          attr.type === 'JSXAttribute' &&
          attr.name.name === 'className'
        );

        if (!hasClassName) {
          context.report({
            node,
            messageId: 'missingClassName',
          });
        }
      },
    };
  },
};

export { jsxClassNameRequiredRule };