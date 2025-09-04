/* global process */
import {
  warningRule,
  warningOptions,
  errorRule,
  errorOptions,
  maxFunctionLinesWarning,
  maxFunctionLinesError
} from "./index.js";

console.log("Testing max-function-lines rule configuration exports...");

// Test warning configuration
console.log("\n📋 Warning Configuration:");
console.log("Rule level:", warningRule);
console.log("Options:", warningOptions);
console.log("Complete config:", maxFunctionLinesWarning);

// Validate warning configuration
if (warningRule === "warn" &&
    warningOptions.max === 50 &&
    warningOptions.skipBlankLines === true &&
    warningOptions.skipComments === true) {
  console.log("✅ Warning configuration is correct");
} else {
  console.log("❌ Warning configuration is incorrect");
  process.exit(1);
}

// Test error configuration
console.log("\n📋 Error Configuration:");
console.log("Rule level:", errorRule);
console.log("Options:", errorOptions);
console.log("Complete config:", maxFunctionLinesError);

// Validate error configuration
if (errorRule === "error" &&
    errorOptions.max === 70 &&
    errorOptions.skipBlankLines === true &&
    errorOptions.skipComments === true) {
  console.log("✅ Error configuration is correct");
} else {
  console.log("❌ Error configuration is incorrect");
  process.exit(1);
}

console.log("\n✅ All max-function-lines configuration tests passed!");

// Test that the configurations are properly formatted for ESLint
console.log("\n📋 ESLint Configuration Format:");
console.log("Warning format:", JSON.stringify(maxFunctionLinesWarning));
console.log("Error format:", JSON.stringify(maxFunctionLinesError));

// Validate ESLint format
if (Array.isArray(maxFunctionLinesWarning) &&
    maxFunctionLinesWarning.length === 2 &&
    maxFunctionLinesWarning[0] === "warn" &&
    typeof maxFunctionLinesWarning[1] === "object") {
  console.log("✅ Warning ESLint format is correct");
} else {
  console.log("❌ Warning ESLint format is incorrect");
  process.exit(1);
}

if (Array.isArray(maxFunctionLinesError) &&
    maxFunctionLinesError.length === 2 &&
    maxFunctionLinesError[0] === "error" &&
    typeof maxFunctionLinesError[1] === "object") {
  console.log("✅ Error ESLint format is correct");
} else {
  console.log("❌ Error ESLint format is incorrect");
  process.exit(1);
}

console.log("\n🎉 All tests completed successfully!");