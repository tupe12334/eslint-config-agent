import config from "../index.js";
import { plugins } from "../plugins/index.js";

const dddConfig = [
  {
    plugins: {
      ddd: plugins.ddd,
    },
    rules: {
      "ddd/require-spec-file": ["error", {
        excludePatterns: [
          "**/*.spec.js",
          "**/*.spec.ts",
          "**/*.test.js",
          "**/*.test.ts",
          "**/index.js",
          "**/index.ts",
          "**/*.d.ts",
          "**/*.config.js",
          "**/*.config.ts",
          "**/eslint.config.js",
          "**/*.stories.{js,jsx,ts,tsx}",
        ],
      }],
    },
  },
];

export default [...config, ...dddConfig];
