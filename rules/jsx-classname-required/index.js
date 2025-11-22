/**
 * ESLint rule to require className attribute on HTML elements in JSX
 *
 * This rule enforces that all HTML elements in JSX must have a non-empty className attribute.
 * It excludes React components (starting with capital letters), fragments, and title elements.
 *
 * Examples:
 * - ❌ <div>Content</div>
 * - ❌ <div className="">Content</div>
 * - ✅ <div className="container">Content</div>
 * - ✅ <MyComponent>Content</MyComponent> (ignored - React component)
 * - ✅ <Fragment>Content</Fragment> (ignored - fragment)
 * - ✅ <React.Fragment>Content</React.Fragment> (ignored - React fragment)
 * - ✅ <React.StrictMode>Content</React.StrictMode> (ignored - React component)
 * - ✅ <title>Page Title</title> (ignored - title element)
 */

const jsxClassNameRequiredRule = {
  meta: {
    type: 'layout',
    docs: {
      description:
        'Require non-empty className attribute on HTML elements in JSX',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: null,
    schema: [],
    messages: {
      missingClassName: 'HTML elements must have a className attribute.',
      emptyClassName:
        'HTML elements must have a non-empty className attribute.',
    },
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        // Skip if this is a React component (starts with capital letter)
        if (
          node.name.type === 'JSXIdentifier' &&
          /^[A-Z]/.test(node.name.name)
        ) {
          return
        }

        // Skip if this is Fragment
        if (
          node.name.type === 'JSXIdentifier' &&
          node.name.name === 'Fragment'
        ) {
          return
        }

        // Skip if this is React.Something (like React.Fragment, React.StrictMode, etc.)
        if (
          node.name.type === 'JSXMemberExpression' &&
          node.name.object.name === 'React' &&
          /^[A-Z]/.test(node.name.property.name)
        ) {
          return
        }

        // Skip if this is a title element (used in document head)
        if (node.name.type === 'JSXIdentifier' && node.name.name === 'title') {
          return
        }

        // Find className attribute
        const classNameAttr = node.attributes.find(
          attr => attr.type === 'JSXAttribute' && attr.name.name === 'className'
        )

        if (!classNameAttr) {
          context.report({
            node,
            messageId: 'missingClassName',
          })
          return
        }

        // Check if className is an empty string
        const value = classNameAttr.value
        if (value && value.type === 'Literal' && value.value === '') {
          context.report({
            node,
            messageId: 'emptyClassName',
          })
        }
      },
    }
  },
}

export { jsxClassNameRequiredRule }
