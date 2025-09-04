import { RuleTester } from "eslint";
import noTrailingSpacesRule from "../../node_modules/eslint/lib/rules/no-trailing-spaces.js";
import { rule, options } from "./index.js";

// Create RuleTester instance
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  }
});

// Test the no-trailing-spaces rule
ruleTester.run("no-trailing-spaces", noTrailingSpacesRule, {
  valid: [
    // Valid: no trailing spaces
    "const foo = 'bar';",
    "function test() {\n  return true;\n}",
    "// This is a comment",
    "const x = 1;\nconst y = 2;",
    "class MyClass {\n  constructor() {\n    this.value = 1;\n  }\n}",
    "const obj = {\n  key: 'value',\n  other: 123\n};",
    "if (true) {\n  console.log('test');\n}",
    "/**\n * Multi-line comment\n * without trailing spaces\n */",
    "const arr = [\n  1,\n  2,\n  3\n];",
    ""  // Empty string is valid
  ],

  invalid: [
    {
      code: "const foo = 'bar';  ",
      errors: [{
        message: "Trailing spaces not allowed.",
        type: "Program"
      }],
      output: "const foo = 'bar';"
    },
    {
      code: "function test() {   \n  return true;\n}",
      errors: [{
        message: "Trailing spaces not allowed.",
        type: "Program"
      }],
      output: "function test() {\n  return true;\n}"
    },
    {
      code: "// Comment with spaces   ",
      errors: [{
        message: "Trailing spaces not allowed.",
        type: "Program"
      }],
      output: "// Comment with spaces"
    },
    {
      code: "const x = 1; \nconst y = 2;  ",
      errors: [
        {
          message: "Trailing spaces not allowed.",
          type: "Program",
          line: 1
        },
        {
          message: "Trailing spaces not allowed.",
          type: "Program",
          line: 2
        }
      ],
      output: "const x = 1;\nconst y = 2;"
    },
    {
      code: "class MyClass {  \n  constructor() {\t\n    this.value = 1;  \n  }  \n}",
      errors: [
        { message: "Trailing spaces not allowed.", line: 1 },
        { message: "Trailing spaces not allowed.", line: 2 },
        { message: "Trailing spaces not allowed.", line: 3 },
        { message: "Trailing spaces not allowed.", line: 4 }
      ],
      output: "class MyClass {\n  constructor() {\n    this.value = 1;\n  }\n}"
    },
    {
      code: "const obj = {  \n  key: 'value',   \n  other: 123  \n};  ",
      errors: [
        { message: "Trailing spaces not allowed.", line: 1 },
        { message: "Trailing spaces not allowed.", line: 2 },
        { message: "Trailing spaces not allowed.", line: 3 },
        { message: "Trailing spaces not allowed.", line: 4 }
      ],
      output: "const obj = {\n  key: 'value',\n  other: 123\n};"
    },
    {
      code: "if (true) { \n  console.log('test');  \n}   ",
      errors: [
        { message: "Trailing spaces not allowed.", line: 1 },
        { message: "Trailing spaces not allowed.", line: 2 },
        { message: "Trailing spaces not allowed.", line: 3 }
      ],
      output: "if (true) {\n  console.log('test');\n}"
    },
    {
      code: "/**  \n * Multi-line comment  \n * with trailing spaces  \n */  ",
      errors: [
        { message: "Trailing spaces not allowed.", line: 1 },
        { message: "Trailing spaces not allowed.", line: 2 },
        { message: "Trailing spaces not allowed.", line: 3 },
        { message: "Trailing spaces not allowed.", line: 4 }
      ],
      output: "/**\n * Multi-line comment\n * with trailing spaces\n */"
    },
    {
      code: "\t\t",
      errors: [{ message: "Trailing spaces not allowed." }],
      output: ""
    },
    {
      code: "   \n   \n   ",
      errors: [
        { message: "Trailing spaces not allowed.", line: 1 },
        { message: "Trailing spaces not allowed.", line: 2 },
        { message: "Trailing spaces not allowed.", line: 3 }
      ],
      output: "\n\n"
    }
  ]
});

console.log("✅ All no-trailing-spaces tests passed!");
console.log(`   Rule severity: ${rule}`);
console.log(`   Options: ${JSON.stringify(options)}`);