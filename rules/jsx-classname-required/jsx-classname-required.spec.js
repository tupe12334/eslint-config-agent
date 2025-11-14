import { RuleTester } from 'eslint'
import { jsxClassNameRequiredRule } from './index.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: (await import('typescript-eslint')).parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('jsx-classname-required', jsxClassNameRequiredRule, {
  valid: [
    // HTML elements with className
    {
      code: '<div className="container">Content</div>',
    },
    {
      code: '<span className="text">Text</span>',
    },
    {
      code: '<p className="paragraph">Paragraph</p>',
    },
    {
      code: '<button className="btn">Button</button>',
    },
    {
      code: '<input className="input" type="text" />',
    },
    {
      code: '<img className="image" src="test.jpg" alt="test" />',
    },

    // React components (should be ignored)
    {
      code: '<MyComponent>Content</MyComponent>',
    },
    {
      code: '<CustomButton onClick={() => {}}>Click</CustomButton>',
    },
    {
      code: '<AnotherComponent prop="value" />',
    },

    // Fragments (should be ignored)
    {
      code: '<Fragment>Content</Fragment>',
    },
    {
      code: '<React.Fragment>Content</React.Fragment>',
    },
    {
      code: '<>Content</>',
    },

    // React.* components (should be ignored)
    {
      code: '<React.StrictMode><div className="content">Content</div></React.StrictMode>',
    },
    {
      code: '<React.Suspense fallback={<div className="loading">Loading</div>}><div className="content">Content</div></React.Suspense>',
    },
    {
      code: '<React.Profiler id="test" onRender={() => {}}><div className="content">Content</div></React.Profiler>',
    },

    // Mixed cases with valid HTML elements
    {
      code: `
        <div className="container">
          <MyComponent>
            <p className="text">Text</p>
          </MyComponent>
          <React.Fragment>
            <span className="fragment-content">Fragment content</span>
          </React.Fragment>
        </div>
      `,
    },

    // Nested valid cases
    {
      code: `
        <div className="outer">
          <div className="inner">
            <span className="nested">Nested content</span>
          </div>
        </div>
      `,
    },
  ],

  invalid: [
    // HTML elements without className
    {
      code: '<div>Content</div>',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<span>Text</span>',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<p>Paragraph</p>',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<button>Button</button>',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<input type="text" />',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<img src="test.jpg" alt="test" />',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },

    // HTML elements inside React components (should still error)
    {
      code: '<MyComponent><div>Content</div></MyComponent>',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<React.StrictMode><div>Content</div></React.StrictMode>',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<React.Fragment><span>Content</span></React.Fragment>',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<Fragment><p>Content</p></Fragment>',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<><div>Content</div></>',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },

    // Multiple errors in one file
    {
      code: `
        <div className="container">
          <span>Missing className</span>
          <p>Also missing className</p>
        </div>
      `,
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },

    // Mixed valid/invalid cases
    {
      code: `
        <div className="container">
          <span className="valid">Valid</span>
          <p>Invalid - no className</p>
          <MyComponent>
            <div>Invalid - no className</div>
          </MyComponent>
        </div>
      `,
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },

    // Edge cases
    {
      code: '<h1>Heading</h1>',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<section>Section</section>',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<article>Article</article>',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<nav>Navigation</nav>',
      errors: [
        {
          messageId: 'missingClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },

    // Empty className strings (should be rejected)
    {
      code: '<div className="">Content</div>',
      errors: [
        {
          messageId: 'emptyClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<span className="">Text</span>',
      errors: [
        {
          messageId: 'emptyClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<p className="">Paragraph</p>',
      errors: [
        {
          messageId: 'emptyClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<button className="">Button</button>',
      errors: [
        {
          messageId: 'emptyClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<input className="" type="text" />',
      errors: [
        {
          messageId: 'emptyClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: '<img className="" src="test.jpg" alt="test" />',
      errors: [
        {
          messageId: 'emptyClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: `
        <div className="container">
          <span className="">Empty className</span>
          <p className="valid">Valid className</p>
        </div>
      `,
      errors: [
        {
          messageId: 'emptyClassName',
          type: 'JSXOpeningElement',
        },
      ],
    },
  ],
})
