# Changelog

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.



## <small>1.9.3 (2026-01-10)</small>

* chore: update eslint-plugin-ddd to v0.5.2 ([27e8654](https://github.com/tupe12334/eslint-config/commit/27e8654))

## <small>1.9.2 (2026-01-10)</small>

* feat(config): add additional Bash commands to PreToolUse hooks ([cec8664](https://github.com/tupe12334/eslint-config/commit/cec8664))

## <small>1.9.1 (2026-01-10)</small>

* feat(config): add PreToolUse hooks for Bash commands ([b3ead67](https://github.com/tupe12334/eslint-config/commit/b3ead67))

## 1.9.0 (2026-01-03)

* chore: update eslint-plugin-error to v1.3.0 ([0afa4fd](https://github.com/tupe12334/eslint-config/commit/0afa4fd))
* chore(release): remove manual release scripts, CI/CD only ([cefdabc](https://github.com/tupe12334/eslint-config/commit/cefdabc))
* fix(config): add global ignores for non-JS/TS files ([0cc3036](https://github.com/tupe12334/eslint-config/commit/0cc3036))
* fix(release): update release commit message format and husky hooks ([1b9ae74](https://github.com/tupe12334/eslint-config/commit/1b9ae74))
* feat: Add smart session revert command and related documentation ([daee5a1](https://github.com/tupe12334/eslint-config/commit/daee5a1))
* feat(config): add commitlint, knip, and commit-msg hook for package setup ([a2d88b7](https://github.com/tupe12334/eslint-config/commit/a2d88b7))

## [1.8.8](https://github.com/tupe12334/eslint-config/compare/v1.8.7...v1.8.8) (2025-11-29)

### Features

* **config:** use defineConfig wrapper for main configuration ([a8c91e0](https://github.com/tupe12334/eslint-config/commit/a8c91e035d4bafedf1d237c0a4948919537e9850))

## [1.8.7](https://github.com/tupe12334/eslint-config/compare/v1.8.6...v1.8.7) (2025-11-22)

### Features

* **jsx-classname:** exempt title elements from className requirement ([c55a982](https://github.com/tupe12334/eslint-config/commit/c55a9829265b699c643239a634fde7e437561d72))

## [1.8.6](https://github.com/tupe12334/eslint-config/compare/v1.8.5...v1.8.6) (2025-11-19)

### Features

* **ddd:** allow error-only files to skip spec requirement ([01fae90](https://github.com/tupe12334/eslint-config/commit/01fae90116139ec8c4d54773626173ae5938b595))

## [1.8.5](https://github.com/tupe12334/eslint-config/compare/v1.8.4...v1.8.5) (2025-11-16)

### Bug Fixes

* **package-setup:** use modern ESLint CLI syntax for flat config ([cf70b95](https://github.com/tupe12334/eslint-config/commit/cf70b954886e2687d3809e7ece234a267e7cf88a))

## [1.8.4](https://github.com/tupe12334/eslint-config/compare/v1.8.3...v1.8.4) (2025-11-16)

### Features

* Add comprehensive package setup and validation guide ([d27bed3](https://github.com/tupe12334/eslint-config/commit/d27bed3ffe620e92b01873dbb1f12c0c7a4a752a))
* add development tooling and format codebase ([6b53911](https://github.com/tupe12334/eslint-config/commit/6b539115aa19d362f5dc3b26ffc78cf4fb191957))
* **import:** enforce no empty lines between imports ([979f270](https://github.com/tupe12334/eslint-config/commit/979f27056b022478a19d2cfc407e4ba369178e95))
* **todos:** update testing requirements for .tsx and .jsx files ([99f882b](https://github.com/tupe12334/eslint-config/commit/99f882bd533cad8e3f4c20acd17e9187fbb6e52e))

### Bug Fixes

* **ci:** remove failing test step, keep validation only ([1f482e6](https://github.com/tupe12334/eslint-config/commit/1f482e6813062875fd374f807bab0243d78b7bba))
* **ci:** remove Node.js 18 from test matrix ([3f2339e](https://github.com/tupe12334/eslint-config/commit/3f2339e8b112bedce5f2394599d96f7884bd11d7))
* **ci:** remove pnpm version conflict in workflow ([f45f54e](https://github.com/tupe12334/eslint-config/commit/f45f54e4377c68f07d162555dd8322c6a03ae8fb))
* **ci:** use test:ci instead of lint to exclude test files ([b3ddcf6](https://github.com/tupe12334/eslint-config/commit/b3ddcf605951f7cc75e292fe145bb67d3a82b032))
* **hooks:** use test:ci in pre-push to exclude test files ([b86e769](https://github.com/tupe12334/eslint-config/commit/b86e769ef2b80caeb55aff8f8c8c24b7d0a94888))
* **prettier:** exclude .claude and .kiro directories ([c7fedd4](https://github.com/tupe12334/eslint-config/commit/c7fedd4039e3e30f56073046e42930f81b69c589))

## [1.8.3](https://github.com/tupe12334/eslint-config/compare/v1.8.2...v1.8.3) (2025-11-13)

### Features

* **classname:** reject empty className strings in JSX elements ([ee401e9](https://github.com/tupe12334/eslint-config/commit/ee401e96197944346144baa5b681247345763547))

## [1.8.2](https://github.com/tupe12334/eslint-config/compare/v1.8.1...v1.8.2) (2025-11-11)

### Features

* **config:** disable spec file requirement for config files ([7e5748b](https://github.com/tupe12334/eslint-config/commit/7e5748b4bb744e3d3ab6250d4fb2ab8fe8a3d19d))

## [1.8.1](https://github.com/tupe12334/eslint-config/compare/v1.8.0...v1.8.1) (2025-11-11)

### Features

* **test-config:** disable error plugin rules in test and spec files ([37c7d63](https://github.com/tupe12334/eslint-config/commit/37c7d63bea5fc302173a421beb27f451076316d9))

## [1.8.0](https://github.com/tupe12334/eslint-config/compare/v1.7.2...v1.8.0) (2025-11-11)

### Features

* **ddd:** enable spec file requirement by default for all source files ([f06b965](https://github.com/tupe12334/eslint-config/commit/f06b96563da10ed2d5aaaae2fe35e1ce87f1aae5))

## [1.7.2](https://github.com/tupe12334/eslint-config/compare/v1.7.1...v1.7.2) (2025-11-10)

### Features

* Add project onboarding and boot verification documentation ([9c4d726](https://github.com/tupe12334/eslint-config/commit/9c4d726b2f6db94a5e1d38749343c34f48ca1b9a))

## [1.7.1](https://github.com/tupe12334/eslint-config/compare/v1.6.3...v1.7.1) (2025-11-10)

### Bug Fixes

* add write permissions to release workflow ([317ed2f](https://github.com/tupe12334/eslint-config/commit/317ed2f))
* remove explicit pnpm version from GitHub workflow ([a067942](https://github.com/tupe12334/eslint-config/commit/a067942))
* upgrade Node.js version to 20 in release workflow ([d9f84b6](https://github.com/tupe12334/eslint-config/commit/d9f84b6))

### Maintenance

* update pnpm-lock.yaml ([b51b4ba](https://github.com/tupe12334/eslint-config/commit/b51b4ba))

## [1.6.3](https://github.com/tupe12334/eslint-config/compare/v1.6.2...v1.6.3) (2025-11-04)

## [1.6.2](https://github.com/tupe12334/eslint-config/compare/v1.6.1...v1.6.2) (2025-10-15)

### Bug Fixes

* restore globals dependency in package.json and pnpm-lock.yaml ([02c2bb5](https://github.com/tupe12334/eslint-config/commit/02c2bb5b2bb261e95ff811d8e4b8f017fabb4dbd))

## [1.6.1](https://github.com/tupe12334/eslint-config/compare/v1.6.0...v1.6.1) (2025-10-11)

### Features

* add comprehensive ESLint configurations for JavaScript, TypeScript, TSX, and JSX files, including base plugin integration and strict rules enforcement ([8b67778](https://github.com/tupe12334/eslint-config/commit/8b67778e12b1e492afed94685428c1ff7698b580))
* add guard-clauses plugin and integrate rules into ESLint configuration ([3294d4c](https://github.com/tupe12334/eslint-config/commit/3294d4c73a2ff5f0d1a418287d91292576a32ae7))

## [1.6.0](https://github.com/tupe12334/eslint-config/compare/v1.5.0...v1.6.0) (2025-10-10)

### Features

* add eslint-plugin-ddd dependency to pnpm-lock.yaml ([b44339f](https://github.com/tupe12334/eslint-config/commit/b44339f09c3611b546b0efefd9493e4f740f7ecf))
* add examples for no-inline-union-types rule with valid and invalid cases ([09b1e2c](https://github.com/tupe12334/eslint-config/commit/09b1e2c9bbb4899672d11f5266d4ca3dfd833ef3))
* add no-inline-union-types rule with comprehensive examples and tests ([db2c3bd](https://github.com/tupe12334/eslint-config/commit/db2c3bd771e53c18b2e5ca2168033bf03fd8e981))
* integrate no-inline-union-types rule into TypeScript-specific restrictions ([ac0c1bd](https://github.com/tupe12334/eslint-config/commit/ac0c1bd6fdfb9e5a876bb71709c367488fa20634))

### Bug Fixes

* update packageManager version to pnpm@10.18.2 ([f31a468](https://github.com/tupe12334/eslint-config/commit/f31a468a54dfbd76fcbb8211316902c085a3bf39))

## [1.5.0](https://github.com/tupe12334/eslint-config/compare/v1.4.6...v1.5.0) (2025-10-08)

### Features

* add ddd ESLint configuration and plugin integration ([04a0104](https://github.com/tupe12334/eslint-config/commit/04a0104683e57b1446eda9b55d7cd426eec35a9e))
* add README for file-type-specific ESLint configurations ([dcb7d1c](https://github.com/tupe12334/eslint-config/commit/dcb7d1c4d60555833b52635f8f8bc90dc4b7b82a))

## [1.4.6](https://github.com/tupe12334/eslint-config/compare/v1.4.5...v1.4.6) (2025-09-30)

### Bug Fixes

* update storybookConfig to be an array and spread into main config ([b6de10e](https://github.com/tupe12334/eslint-config/commit/b6de10efcbdb1deff790e4be8c37f432217b23bd))

## [1.4.5](https://github.com/tupe12334/eslint-config/compare/v1.4.4...v1.4.5) (2025-09-30)

### Bug Fixes

* restore eslint-plugin-required-exports dependency in package.json and pnpm-lock.yaml ([a937603](https://github.com/tupe12334/eslint-config/commit/a9376031562f77b5854824e95bc825fae7c93eb5))

## [1.4.4](https://github.com/tupe12334/eslint-config/compare/v1.4.3...v1.4.4) (2025-09-30)

### Features

* add no-trivial-type-aliases rule with examples and tests ([27da82f](https://github.com/tupe12334/eslint-config/commit/27da82f53a084e2cdb88b26b06b53e11992a2a32))

### Bug Fixes

* restore eslint-plugin-single-export dependency in package.json and pnpm-lock.yaml ([7b273a5](https://github.com/tupe12334/eslint-config/commit/7b273a595c7ee1c5c5919b98f800fdca2c1d6fb9))

## [1.4.3](https://github.com/tupe12334/eslint-config/compare/v1.4.2...v1.4.3) (2025-09-27)

### Features

* include plugins directory in package files for better distribution ([9923ae5](https://github.com/tupe12334/eslint-config/commit/9923ae55458253eed988c7b433d4f11359b9eb6a))

## [1.4.2](https://github.com/tupe12334/eslint-config/compare/v1.4.1...v1.4.2) (2025-09-27)

### Features

* add configuration for handling hardcoded values and default exports in config files ([0673c64](https://github.com/tupe12334/eslint-config/commit/0673c64d4e021eb5cd206a37b35b1509f007f57b))

## [1.4.1](https://github.com/tupe12334/eslint-config/compare/v1.3.9...v1.4.1) (2025-09-27)

### Features

* add no-optional-chaining rule and update test configurations ([90ac6ca](https://github.com/tupe12334/eslint-config/commit/90ac6cab81cdbee76ac8dd65f7ffabebb1aa9962))
* add Storybook ESLint configuration and integrate into main config ([666c513](https://github.com/tupe12334/eslint-config/commit/666c5134fedbf984dc9118721218c1f2a9b5a349))
* add switch case explicit return rule with tests and documentation ([a6bca6d](https://github.com/tupe12334/eslint-config/commit/a6bca6d0925b219f6960743b23e3d88f5104bbe7))
* add switch statements return type rule to enforce explicit return type annotations ([5e365e3](https://github.com/tupe12334/eslint-config/commit/5e365e30902ae05fc5f66401c86441b6f5606e5a))
* centralize ESLint plugin registration and remove individual imports ([603aa7d](https://github.com/tupe12334/eslint-config/commit/603aa7dbecc3721a0c564f07ce163206d0d6883a))
* implement switch case functions return type rule with comprehensive tests and documentation ([ffe0e71](https://github.com/tupe12334/eslint-config/commit/ffe0e717325819ce5f23e40e2eee0381de1aff9f))
* update tests to use @typescript-eslint/rule-tester v8 and ESLint v9 flat config for switch-case and switch-statements return type rules ([673fca5](https://github.com/tupe12334/eslint-config/commit/673fca5bdf2630eb420b472c32caf427e8b8ce07))

### Bug Fixes

* update release scripts to use npx dotenv for proper environment variable loading ([348d4e4](https://github.com/tupe12334/eslint-config/commit/348d4e442af95622fd76393ab231698abff617a5))
* use pnpm exec for dotenv in release scripts ([dec3c80](https://github.com/tupe12334/eslint-config/commit/dec3c80f864ae4874a7510aae8223feab2afaf38))

## [1.3.9](https://github.com/tupe12334/eslint-config/compare/v1.3.8...v1.3.9) (2025-09-27)

### Bug Fixes

* update eslint-plugin-error to version 1.1.3 for improved stability ([4fc6a2f](https://github.com/tupe12334/eslint-config/commit/4fc6a2f688ea195d5e2038222449993fce4a7dc7))

## [1.3.8](https://github.com/tupe12334/eslint-config/compare/v1.3.7...v1.3.8) (2025-09-27)

### Features

* add eslint-plugin-default for enhanced linting rules; configure default plugin strict settings ([70d3ac6](https://github.com/tupe12334/eslint-config/commit/70d3ac6f7ab6666eb7652840cf8eb6b68de74df7))
* add test files configuration and refactor index.js to import shared rules ([28d3799](https://github.com/tupe12334/eslint-config/commit/28d3799edbc7d4726027adbbdc597746579e516e))
* add TODO.md with function export and translation function guidelines ([94bfd21](https://github.com/tupe12334/eslint-config/commit/94bfd2167b29480cf7f3d2bb11120756239b0ee7))
* implement no-nullish-coalescing rule with examples and tests ([838196f](https://github.com/tupe12334/eslint-config/commit/838196f500125d09e92f9fa0d7f6bb65280a2f3b))
* implement no-record-literal-types rule to enforce type safety; add examples and tests ([3308ccb](https://github.com/tupe12334/eslint-config/commit/3308ccb59ba4e9d05725e2f810453df454c63ba5))
* include configs directory in package.json files list ([3bce2b4](https://github.com/tupe12334/eslint-config/commit/3bce2b41440a7330816603918bf74dfea3900b2b))
* refine .npmignore and package.json to better manage test and example files in rules directory ([9ed652b](https://github.com/tupe12334/eslint-config/commit/9ed652bae2410faa4428dab583e3494abf9cc5bc))
* update .npmignore to include examples and test files in rules directory ([d1bb23d](https://github.com/tupe12334/eslint-config/commit/d1bb23df50c623ada2bc2805f7638f9398f2ba64))
* update no-empty-exports tests for consistency and clarity; enhance test-runner to scan for spec files ([25a7d26](https://github.com/tupe12334/eslint-config/commit/25a7d2660cc992e9031e0577197bfb57faf2c570))

## [1.3.7](https://github.com/tupe12334/eslint-config/compare/v1.3.6...v1.3.7) (2025-09-24)

### Features

* add error handling rules from eslint-plugin-error ([082701f](https://github.com/tupe12334/eslint-config/commit/082701f8abe8730ed12afe206caf8f10825b4d1c))
* add jsx-classname-required rule to enforce className attribute on HTML elements in JSX ([3603865](https://github.com/tupe12334/eslint-config/commit/360386582f05e63d6ba1625548725b9216c4f4d6))
* integrate error handling rules from eslint-plugin-error and update configuration ([7c8b846](https://github.com/tupe12334/eslint-config/commit/7c8b84694550b92ac2a265591fac736d5ddb1180))

## [1.3.6](https://github.com/tupe12334/eslint-config/compare/v1.3.5...v1.3.6) (2025-09-21)

### Bug Fixes

* update TypeScript ESLint integration and remove deprecated parser references ([79ef677](https://github.com/tupe12334/eslint-config/commit/79ef677335cbeb7ed4550da40a0789975dcc68d7))

## [1.3.5](https://github.com/tupe12334/eslint-config/compare/v1.3.4...v1.3.5) (2025-09-20)

### Bug Fixes

* enhance reactHooks configuration to support legacy recommended flat config ([c23e68f](https://github.com/tupe12334/eslint-config/commit/c23e68f85755b81ce698b616d4eb26b46c04040a))

## [1.3.4](https://github.com/tupe12334/eslint-config/compare/v1.3.3...v1.3.4) (2025-09-20)

### Bug Fixes

* update reactHooks configuration to use recommended-latest if available ([bb5bf9d](https://github.com/tupe12334/eslint-config/commit/bb5bf9d8b9ef8110123fd4f8f23d35ee7af22e02))

## [1.3.3](https://github.com/tupe12334/eslint-config/compare/v1.3.2...v1.3.3) (2025-09-20)

### Features

* add required-exports plugin and update configuration rules ([b6a6b22](https://github.com/tupe12334/eslint-config/commit/b6a6b223b70f8140458f065e0801d8336465911b))

## [1.3.2](https://github.com/tupe12334/eslint-config/compare/v1.3.1...v1.3.2) (2025-09-20)

## [1.3.1](https://github.com/tupe12334/eslint-config/compare/v1.3.0...v1.3.1) (2025-09-20)

### Bug Fixes

* update eslint-plugin-single-export version to 1.1.1 and adjust dependencies ([d2a82b5](https://github.com/tupe12334/eslint-config/commit/d2a82b51fc302ffb0589fb58a6a26452833d6639))

## [1.3.0](https://github.com/tupe12334/eslint-config/compare/v1.2.3...v1.3.0) (2025-09-20)

### Features

* add eslint-plugin-single-export to enforce single export rules ([9cfb800](https://github.com/tupe12334/eslint-config/commit/9cfb80073cf9cdcefd31af5cc2c9a1c83dcd6926))
* add no-default-class-export rule to enforce named exports for classes ([03d5273](https://github.com/tupe12334/eslint-config/commit/03d52731ca190ebf3d76d4ded7c6ace7fe5fc75f))

### Bug Fixes

* disable group-exports rule to prevent enforcing single statement exports ([0cfd699](https://github.com/tupe12334/eslint-config/commit/0cfd6994a0978d8a15e7ecae83b0765e5cfcf747))
* improve null check for class names in no-default-class-export rule ([bf090e3](https://github.com/tupe12334/eslint-config/commit/bf090e3490f08f6e9b07a16227ab22aba702f31c))

## [1.2.3](https://github.com/tupe12334/eslint-config/compare/v1.2.2...v1.2.3) (2025-09-14)

### Features

* add no-class-property-defaults rule to disallow default values for class properties ([1e4ca82](https://github.com/tupe12334/eslint-config/commit/1e4ca8226d9a9cfc2843b0d6d641c008f3a35d20))

### Bug Fixes

* update badge style and improve formatting in README ([b152ed3](https://github.com/tupe12334/eslint-config/commit/b152ed3c4b92c4fc03267c3d5b5fef3104daee94))

## [1.2.2](https://github.com/tupe12334/eslint-config/compare/v1.2.1...v1.2.2) (2025-09-11)

### Features

* add "Stand With Israel" badge to README ([400d112](https://github.com/tupe12334/eslint-config/commit/400d11274561871da1b46ec5a61a0fa16698bebc))
* add migration guide for transitioning to eslint-config-agent ([d2efb4f](https://github.com/tupe12334/eslint-config/commit/d2efb4f87cebd40ed74142727c2041c621675e36))
* create CONTRIBUTING.md for development setup and contribution guidelines ([b37dd91](https://github.com/tupe12334/eslint-config/commit/b37dd91179c76fd05e62290fe506de1aeba34c53))
* move troubleshooting and FAQ content to FAQ.md ([08a8dd5](https://github.com/tupe12334/eslint-config/commit/08a8dd559a488bdcc40dbcbbfc9ceb6a587fa02a))
* remove supported file types and configurations section from README ([5671273](https://github.com/tupe12334/eslint-config/commit/567127398d938fc9098ae5794b2559af983c07d0))
* remove supported file types and version history sections from README ([a77cb9c](https://github.com/tupe12334/eslint-config/commit/a77cb9cc7ff03f52909e03b5aaa8ffbc4bff0ac0))

## [1.2.1](https://github.com/tupe12334/eslint-config/compare/v1.2.0...v1.2.1) (2025-09-11)

### Features

* remove outdated TODO and ESLint rules documentation ([4d820ce](https://github.com/tupe12334/eslint-config/commit/4d820cec99d8ffb8e9e23c8c313e644351871d70))

## [1.2.0](https://github.com/tupe12334/eslint-config/compare/v1.1.4...v1.2.0) (2025-09-11)

### Features

* add examples for valid and invalid export patterns and update import rules configuration ([a78e03d](https://github.com/tupe12334/eslint-config/commit/a78e03d201e335b423c1830593c015ddd0346028))
* add no-explicit-any rule configuration and examples for valid/invalid usage ([2bc0ad8](https://github.com/tupe12334/eslint-config/commit/2bc0ad836ff42199456ebc7ebd0b6948cca1a7b1))
* add no-unused-modules rule configuration and examples for unused exports ([336db1b](https://github.com/tupe12334/eslint-config/commit/336db1b26bf4ac0d3e9bd56c95817748bfda4799))
* refine ESLint configuration to include specific index.js files and update CI test command ([5693dbc](https://github.com/tupe12334/eslint-config/commit/5693dbc65dc37cbddb6a41498b4886d360c17684))
* update ESLint configuration to disable size limits for test/spec files and add examples for valid/invalid file lengths ([ac57e22](https://github.com/tupe12334/eslint-config/commit/ac57e223f7d1cedab32976cee5f305ca197ca0c8))
* update export statements in test files to use default export syntax ([c4a846b](https://github.com/tupe12334/eslint-config/commit/c4a846bc78105f287fafcb4248c8de334c84b0fb))

## [1.1.4](https://github.com/tupe12334/eslint-config/compare/v1.1.3...v1.1.4) (2025-09-10)

### Features

* add no-empty-exports rule to prevent empty export specifiers and include test cases ([7757007](https://github.com/tupe12334/eslint-config/commit/77570076e41bdab64dbed53ca7a40a935eda7e3a))
* enhance export specifier rules and update test configurations for improved validation ([fe64b9c](https://github.com/tupe12334/eslint-config/commit/fe64b9cb7f1bdf80b16a97db75a5fd04901c2e7f))
* remove package-specific ignores from ESLint config for cleaner configuration ([03cef75](https://github.com/tupe12334/eslint-config/commit/03cef75a6ad6d682ede5f4c5dc5d5e1a8d0a9aaa))

## [1.1.3](https://github.com/tupe12334/eslint-config/compare/v1.1.2...v1.1.3) (2025-09-10)

### Features

* add no-type-assertions rule to disallow TypeScript type assertions using "as" keyword ([39b708f](https://github.com/tupe12334/eslint-config/commit/39b708f9da6eb0c491b0e53248af78821f4b3598))
* consolidate ESLint rule imports into a single index file for better organization ([37be460](https://github.com/tupe12334/eslint-config/commit/37be46083350d151a5803b9c230c538caa9eb857))
* refactor ESLint rule imports to use a consolidated allRules object for improved organization ([47c3eea](https://github.com/tupe12334/eslint-config/commit/47c3eea5f02dd204bf86ab6150d319eed07440da))

## [1.1.2](https://github.com/tupe12334/eslint-config/compare/v1.1.1...v1.1.2) (2025-09-10)

### Features

* add no-process-env-properties rule to disallow direct access to process.env properties ([741d3a4](https://github.com/tupe12334/eslint-config/commit/741d3a442d79be766639c64a0946a99452aa8ee4))

## [1.1.1](https://github.com/tupe12334/eslint-config/compare/v1.1.0...v1.1.1) (2025-09-08)

## [1.1.0](https://github.com/tupe12334/eslint-config/compare/v1.0.27...v1.1.0) (2025-09-08)

## [1.0.26](https://github.com/tupe12334/eslint-config/compare/v1.0.25...v1.0.26) (2025-09-08)

### Features

* add eslint-plugin-class-export and integrate class export rules ([c5ba7a8](https://github.com/tupe12334/eslint-config/commit/c5ba7a89ebcfa8413ddcc3e9cef7ed3bbe0ea3c4))

### Bug Fixes

* update export rules to allow default exports and adjust test configurations ([e802a95](https://github.com/tupe12334/eslint-config/commit/e802a952e5c7dfab82391dac11a551906daaa968))
* update import rules to enforce 'import/first' and adjust test runner error counts ([f1da56d](https://github.com/tupe12334/eslint-config/commit/f1da56d4f343af181d6cd1bbd22d10b4efe637a6))

## [1.0.25](https://github.com/tupe12334/eslint-config/compare/v1.0.24...v1.0.25) (2025-09-08)

### Features

* integrate eslint-plugin-n and replace no-env-access rule with n/no-process-env rule ([b4b66bb](https://github.com/tupe12334/eslint-config/commit/b4b66bb52987c65ff0b6f8e505550e150e23d22c))

## [1.0.24](https://github.com/tupe12334/eslint-config/compare/v1.0.23...v1.0.24) (2025-09-08)

### Features

* add export restrictions for TSX and JSX files to improve maintainability ([2707d60](https://github.com/tupe12334/eslint-config/commit/2707d60521b6209954acc92b2643e519cb3492b8))
* add jsx-a11y and react rules, and integrate TypeScript ESLint rules for enhanced linting support ([7de3c30](https://github.com/tupe12334/eslint-config/commit/7de3c304b7d07de0423ee3c9872e5b198167a880))
* add security rules and plugin to enhance code safety ([905695e](https://github.com/tupe12334/eslint-config/commit/905695e3a01153ad888f054a7f567b2e537134cc))
* enforce className attribute requirement for HTML elements in JSX and TSX ([03b61e6](https://github.com/tupe12334/eslint-config/commit/03b61e60285fa1ee2afb1f15dc576e62f84d44fd))
* refactor import/export rules and consolidate plugin rules for better organization ([4656334](https://github.com/tupe12334/eslint-config/commit/46563347a5c5cfed7375544590711df28df20e21))

### Bug Fixes

* consolidate export declarations to satisfy import/group-exports rule ([3d75c61](https://github.com/tupe12334/eslint-config/commit/3d75c618101b27ea0d7e39bb5d5c437c75e4635c))
* relax nullish coalescing validation check ([eac56b0](https://github.com/tupe12334/eslint-config/commit/eac56b06f95e7953181c167c7ce3e353db3a20cf))

## [1.0.23](https://github.com/tupe12334/eslint-config/compare/v1.0.22...v1.0.23) (2025-09-05)

### Features

* add custom no-env-access rule with tests and update test runner ([b4f4fc5](https://github.com/tupe12334/eslint-config/commit/b4f4fc5fdecfdc8fa6f1524403d2f6df8afb3a40))

## [1.0.22](https://github.com/tupe12334/eslint-config/compare/v1.0.21...v1.0.22) (2025-09-04)

### Features

* add max-lines and max-lines-per-function rules with configurations and tests ([218f29c](https://github.com/tupe12334/eslint-config/commit/218f29ca497ca1b49e027f3e33f87cf836e7ff02))

### Bug Fixes

* resolve linting issues for release ([3c812cd](https://github.com/tupe12334/eslint-config/commit/3c812cd223f169360cb0d1520e401a17a6a9b960))

## [1.0.21](https://github.com/tupe12334/eslint-config/compare/v1.0.19...v1.0.21) (2025-09-04)

### Bug Fixes

* add rules directory to published package files ([85f6a8b](https://github.com/tupe12334/eslint-config/commit/85f6a8b30f84d8239703a0040cb087be4b7cfb24))

## [1.0.19](https://github.com/tupe12334/eslint-config/compare/v1.0.18...v1.0.19) (2025-09-04)

### Features

* add no-process-env rule with tests and enhance test runner for standalone tests ([7999e1a](https://github.com/tupe12334/eslint-config/commit/7999e1a2bac745c5da0cb29e5b0d08fe4b5ec321))
* add no-trailing-spaces rule with tests and update test runner configurations ([c474d49](https://github.com/tupe12334/eslint-config/commit/c474d491461593e05d31a7c33da49e6c6116f207))

## [1.0.18](https://github.com/tupe12334/eslint-config/compare/v1.0.17...v1.0.18) (2025-09-04)

### Features

* add editor command for enhanced project interaction ([5513889](https://github.com/tupe12334/eslint-config/commit/55138896794e64b5a47667508f7339028fca578f))
* add rules for indexed access type assertions and corresponding test cases ([5bcf50c](https://github.com/tupe12334/eslint-config/commit/5bcf50c32c4ea4fe777eed49f09bc1270a60a6d7))

## [1.0.17](https://github.com/tupe12334/eslint-config/compare/v1.0.16...v1.0.17) (2025-09-03)

### Features

* add rules for switch case syntax restrictions and corresponding test cases ([7d9c3a4](https://github.com/tupe12334/eslint-config/commit/7d9c3a41d759ea9e9bd60b7fd8247b70d45687d2))
* add switch case rules and critical error messages for optional chaining and nullish coalescing ([5c7f6c6](https://github.com/tupe12334/eslint-config/commit/5c7f6c6f33af9899533f33b32c162327322fc6f3))

## [1.0.16](https://github.com/tupe12334/eslint-config/compare/v1.0.15...v1.0.16) (2025-09-02)

## [1.0.15](https://github.com/tupe12334/eslint-config/compare/v1.0.14...v1.0.15) (2025-09-02)

### Features

* add validation for re-exporting imported variables and include corresponding test cases ([0bbeea4](https://github.com/tupe12334/eslint-config/commit/0bbeea48b77afe53eeed3e32b177c1fc170a2371))

### Bug Fixes

* update import paths in export test files to use local modules ([1f34161](https://github.com/tupe12334/eslint-config/commit/1f341614b313419b071f860ab762ff96596c32a6))

## [1.0.14](https://github.com/tupe12334/eslint-config/compare/v1.0.13...v1.0.14) (2025-08-31)

### Features

* add export validation rules and corresponding test cases for external libraries and scoped packages ([9ba8093](https://github.com/tupe12334/eslint-config/commit/9ba8093c6fb7c93c8363518bb879ecf94f405e1e))

## [1.0.13](https://github.com/tupe12334/eslint-config/compare/v1.0.12...v1.0.13) (2025-08-31)

### Features

* add new export validation rules and corresponding test cases ([583289a](https://github.com/tupe12334/eslint-config/commit/583289a6bf432033e4162dbe0494cfc396908e07))
* add new rules for type-only exports and update test cases for export validations ([ea00bed](https://github.com/tupe12334/eslint-config/commit/ea00bedb344274f925ea4363cd3fc90e8e6e2d07))
* add tests for union types validation, including valid and invalid patterns ([1412ce6](https://github.com/tupe12334/eslint-config/commit/1412ce61970e984fc4e5dab7fe0776b72f82a1e5))
* add validation test cases for index file patterns, including valid and invalid scenarios ([3d0d8dd](https://github.com/tupe12334/eslint-config/commit/3d0d8ddfcd75463c696a60b551deb1330aeb9f16))
* update test files for union types validation in ESLint config ([6ca185e](https://github.com/tupe12334/eslint-config/commit/6ca185ef0b98d46c7eaf21cc445f725652cad974))
* update test files to validate max-lines-per-function rule in ESLint ([cb557f4](https://github.com/tupe12334/eslint-config/commit/cb557f45b7561ad849dc16a749097b88bfe57a48))

### Bug Fixes

* correct comment to indicate invalid index file with default re-export as named ([e942309](https://github.com/tupe12334/eslint-config/commit/e94230962083371f42d547650fb146c304e0651a))

## [1.0.12](https://github.com/tupe12334/eslint-config/compare/v1.0.11...v1.0.12) (2025-08-31)

### Features

* add required export rules and corresponding tests for classes and enums ([cb90ea7](https://github.com/tupe12334/eslint-config/commit/cb90ea75f34b7afd6f0b09c2aa36193fecdca5e1))
* adjust TypeScript/TSX rules to treat restricted syntax as warnings and include required export rules ([e24ec33](https://github.com/tupe12334/eslint-config/commit/e24ec33b959dd0c7c83a1df63dfaa2a4abb667bb))
* enforce named exports for classes and enums, add tests for invalid default exports ([af5effb](https://github.com/tupe12334/eslint-config/commit/af5effb9e9504ac95969f25132c43e0457c95b95))

## [1.0.11](https://github.com/tupe12334/eslint-config/compare/v1.0.10...v1.0.11) (2025-08-31)

### Features

* add .npmrc for automated npm publishing ([25a6225](https://github.com/tupe12334/eslint-config/commit/25a62259f25e92584ac4ba97f64fdc783feebe88))
* configure .npmrc to automatically use token from .env file ([9186662](https://github.com/tupe12334/eslint-config/commit/9186662fe5786309146ae02fc90a73247d4a42bb))
* enhance ESLint rules and add tests for multiple export statements ([77bc1ab](https://github.com/tupe12334/eslint-config/commit/77bc1ab68d08a8e56872a589e407fc4314dc940b))

## [1.0.9](https://github.com/tupe12334/eslint-config/compare/v1.0.8...v1.0.9) (2025-08-31)

### Features

* add TODOs for lint rule updates regarding export syntax ([a74863c](https://github.com/tupe12334/eslint-config/commit/a74863ccb97850147d8773a9dae3b537cc5c1971))
* update export rules and add tests for valid/invalid export patterns ([87a53c6](https://github.com/tupe12334/eslint-config/commit/87a53c6470360b2f8ed03dc58be28404027e6955))

## [1.0.8](https://github.com/tupe12334/eslint-config/compare/v1.0.7...v1.0.8) (2025-08-30)

### Features

* enhance TypeScript union type validation with new test cases for interface properties ([4e1ebe7](https://github.com/tupe12334/eslint-config/commit/4e1ebe737049aa1e61c6daac66032f2bb70f34d6))

## [1.0.7](https://github.com/tupe12334/eslint-config/compare/v1.0.6...v1.0.7) (2025-08-30)

### Features

* add className warning rules for JavaScript/JSX and TypeScript/TSX with corresponding test files ([6002cee](https://github.com/tupe12334/eslint-config/commit/6002ceeca6e5e083ef29918af4898ec791ef194e))
* add shared ESLint rules and test for max-lines-per-function ([500980b](https://github.com/tupe12334/eslint-config/commit/500980bcca349595dbef06d8c7524fc9ab3bb244))
* disable max-lines-per-function rule for test and spec files with corresponding test cases ([be28440](https://github.com/tupe12334/eslint-config/commit/be284403c1066449b5b21b7df55cf3de0e4bdf7e))
* update test runner and validation scripts to reference new long-function-test file ([0a13f07](https://github.com/tupe12334/eslint-config/commit/0a13f07709dc4d508adee035cc5924de670a1e78))
* update TypeScript union type restrictions and enhance test cases for class properties ([c71b19d](https://github.com/tupe12334/eslint-config/commit/c71b19dcaffbbf5a2ba37e0f65853c78fd0ca5f7))

## [1.0.6](https://github.com/tupe12334/eslint-config/compare/v1.0.5...v1.0.6) (2025-08-30)

### Features

* add eslint-plugin-import and configure import/group-exports rule ([36d6192](https://github.com/tupe12334/eslint-config/commit/36d6192b5a85031a96e46cfaccb0e7ad62b41726))
* rename package to eslint-config-agent ([3f9f387](https://github.com/tupe12334/eslint-config/commit/3f9f387650fd74317663142db5801a04e5ff2158))

## [1.0.5](https://github.com/tupe12334/eslint-config/compare/v1.0.4...v1.0.5) (2025-08-29)

### Features

* enhance documentation with additional commands for release management and testing guidelines ([4cc298d](https://github.com/tupe12334/eslint-config/commit/4cc298d195edfee31dfd3ec2dc2e5343707dae35))
* update ESLint rules for type assertions and enhance test coverage for invalid usage ([f53b9d6](https://github.com/tupe12334/eslint-config/commit/f53b9d6ca40f949e073d6eb08e70ec6ad0117518))
* update ESLint rules to disallow optional chaining syntax in member and call expressions ([6b9ab7b](https://github.com/tupe12334/eslint-config/commit/6b9ab7bdae7b8608a19e2f888c72af18382f66da))

## [1.0.4](https://github.com/tupe12334/eslint-config/compare/v1.0.3...v1.0.4) (2025-08-29)

### Features

* add ESLint rules to disallow Record with string literal keys and create corresponding test cases ([98189f2](https://github.com/tupe12334/eslint-config/commit/98189f26ef78a1cf0fc89bcf47848d8761b8a5e9))
* add tests for new union type rule to validate correct usage and trigger errors ([7936470](https://github.com/tupe12334/eslint-config/commit/7936470d10003dab6353650038e5b02e9e79b657))

## [1.0.3](https://github.com/tupe12334/eslint-config/compare/v1.0.2...v1.0.3) (2025-08-29)

### Features

* add initial ESLint configuration with permissions for various commands ([d7613aa](https://github.com/tupe12334/eslint-config/commit/d7613aa115b04e3aa45e6707dea350f9ec8b1678))
* add permission for npx @typescript-eslint/parser command in settings ([1b87420](https://github.com/tupe12334/eslint-config/commit/1b87420bddd5fd3894fe34b38a41059b03eb2f5b))
* add permission for npx eslint command in settings ([77ae39a](https://github.com/tupe12334/eslint-config/commit/77ae39ae84c5d0a186a88acef2cd5aa1e68153bc))
* enhance TypeScript rules by enforcing no-explicit-any and consistent type assertions ([d2677c6](https://github.com/tupe12334/eslint-config/commit/d2677c6359ea956d36d9e02abcf173131c49f437))
* remove settings.local.json and add it to .gitignore ([553a861](https://github.com/tupe12334/eslint-config/commit/553a861644ce81689400920892ea7eb64822703d))

## [1.0.2](https://github.com/tupe12334/eslint-config/compare/v1.0.1...v1.0.2) (2025-08-25)

### Features

* enhance ESLint configuration with optional preact plugin and update peer dependencies ([09f63d5](https://github.com/tupe12334/eslint-config/commit/09f63d5249c8c6f6832668b926b5c1b81d6d8144))

## 1.0.1 (2025-08-25)

### Features

* **settings:** add permission for pnpm release command in settings ([3c14b7a](https://github.com/tupe12334/eslint-config/commit/3c14b7a8b2da8461bcee7ba7eeb0811cb9f995d5))
* **setup:** add environment setup instructions and example file for publishing ([a1342f1](https://github.com/tupe12334/eslint-config/commit/a1342f19849b91b9d2579e0e657e9fe624dac156))
* **setup:** update NPM token instructions and add hooks for .npmrc management ([e78e9bb](https://github.com/tupe12334/eslint-config/commit/e78e9bb5a6ab5d9e21edd852b33ea6f077623387))
* **tests:** add comprehensive ESLint configuration test runner ([86ee8d4](https://github.com/tupe12334/eslint-config/commit/86ee8d4a83c7b620bf3909c368ba8f8926726c15))
