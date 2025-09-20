import { RuleTester } from "eslint";
import { noDefaultClassExportRule } from "./index.js";

/**
 * Test suite for no-default-class-export rule
 *
 * This tests the custom ESLint rule that prevents default class exports
 * and provides auto-fix functionality to convert them to named exports.
 */

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    parser: (await import("@typescript-eslint/parser")).default,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("no-default-class-export", noDefaultClassExportRule, {
  valid: [
    // Valid: Named class export
    {
      code: `
        export class UserService {
          constructor() {}
        }
      `,
    },
    // Valid: Multiple named exports including class
    {
      code: `
        export interface UserData {
          id: number;
          name: string;
        }

        export class UserRepository {
          save(user: UserData): void {}
        }

        export const DEFAULT_USER: UserData = {
          id: 0,
          name: 'Anonymous'
        };
      `,
    },
    // Valid: Abstract class with named export
    {
      code: `
        export abstract class BaseService {
          abstract initialize(): void;
        }
      `,
    },
    // Valid: Generic class with named export
    {
      code: `
        export class Container<T> {
          private items: T[] = [];
          add(item: T): void {
            this.items.push(item);
          }
        }
      `,
    },
    // Valid: Class with decorators (named export)
    {
      code: `
        @Injectable()
        export class ApiService {
          constructor() {}
        }
      `,
    },
    // Valid: Default export of non-class
    {
      code: `
        export default function createUser() {
          return { id: 1, name: 'Test' };
        }
      `,
    },
    // Valid: Default export of constant
    {
      code: `
        const config = { apiUrl: 'http://localhost' };
        export default config;
      `,
    },
    // Valid: Default export of object
    {
      code: `
        export default {
          users: [],
          addUser(name: string) {
            this.users.push(name);
          }
        };
      `,
    },
  ],

  invalid: [
    // Invalid: Default class declaration export
    {
      code: `
        export default class UserService {
          constructor() {}
        }
      `,
      output: `
        export class UserService {
          constructor() {}
        }
      `,
      errors: [
        {
          messageId: "noDefaultClassDeclaration",
        },
      ],
    },
    // Invalid: Default anonymous class (treated as declaration)
    {
      code: `
        export default class {
          getValue() {
            return 42;
          }
        }
      `,
      output: `
        export class ClassName {
          getValue() {
            return 42;
          }
        }
      `,
      errors: [
        {
          messageId: "noDefaultClassDeclaration",
        },
      ],
    },
    // Invalid: Default abstract class
    {
      code: `
        export default abstract class BaseHandler {
          abstract handle(): void;
        }
      `,
      output: `
        export abstract class BaseHandler {
          abstract handle(): void;
        }
      `,
      errors: [
        {
          messageId: "noDefaultClassDeclaration",
        },
      ],
    },
    // Invalid: Default generic class
    {
      code: `
        export default class Repository<T> {
          private items: T[] = [];
          save(item: T): void {
            this.items.push(item);
          }
        }
      `,
      output: `
        export class Repository<T> {
          private items: T[] = [];
          save(item: T): void {
            this.items.push(item);
          }
        }
      `,
      errors: [
        {
          messageId: "noDefaultClassDeclaration",
        },
      ],
    },
    // Invalid: Default class with decorators
    {
      code: `
        @Injectable()
        export default class ApiService {
          constructor() {}
        }
      `,
      output: `
        @Injectable()
        export class ApiService {
          constructor() {}
        }
      `,
      errors: [
        {
          messageId: "noDefaultClassDeclaration",
        },
      ],
    },
    // Invalid: Default class extending another class
    {
      code: `
        export default class ConcreteService extends BaseService {
          initialize(): void {}
        }
      `,
      output: `
        export class ConcreteService extends BaseService {
          initialize(): void {}
        }
      `,
      errors: [
        {
          messageId: "noDefaultClassDeclaration",
        },
      ],
    },
    // Invalid: Default class implementing interface
    {
      code: `
        export default class UserService implements IUserService {
          getUsers(): User[] {
            return [];
          }
        }
      `,
      output: `
        export class UserService implements IUserService {
          getUsers(): User[] {
            return [];
          }
        }
      `,
      errors: [
        {
          messageId: "noDefaultClassDeclaration",
        },
      ],
    },
    // Invalid: Default class with static methods
    {
      code: `
        export default class Utils {
          static format(text: string): string {
            return text.trim();
          }
        }
      `,
      output: `
        export class Utils {
          static format(text: string): string {
            return text.trim();
          }
        }
      `,
      errors: [
        {
          messageId: "noDefaultClassDeclaration",
        },
      ],
    },
    // Invalid: Named class expression (edge case)
    {
      code: `
        export default class NamedClass {
          test() {
            return 'test';
          }
        }
      `,
      output: `
        export class NamedClass {
          test() {
            return 'test';
          }
        }
      `,
      errors: [
        {
          messageId: "noDefaultClassDeclaration",
        },
      ],
    },
  ],
});

console.log("✅ All no-default-class-export rule tests passed!");

// Export for potential use in other test files
export { noDefaultClassExportRule };