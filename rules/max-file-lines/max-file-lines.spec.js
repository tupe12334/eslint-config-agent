import {
  warningRule,
  warningOptions,
  errorRule,
  errorOptions,
  maxFileLinesWarning,
  maxFileLinesError,
} from './index.js'

console.log('Testing max-file-lines rule configuration exports...')

// Test warning configuration
console.log('\n📋 Warning Configuration:')
console.log('Rule level:', warningRule)
console.log('Options:', warningOptions)
console.log('Complete config:', maxFileLinesWarning)

// Validate warning configuration
if (
  warningRule === 'warn' &&
  warningOptions.max === 70 &&
  warningOptions.skipBlankLines === true &&
  warningOptions.skipComments === true
) {
  console.log('✅ Warning configuration is correct')
} else {
  console.log('❌ Warning configuration is incorrect')
  process.exit(1)
}

// Test error configuration
console.log('\n📋 Error Configuration:')
console.log('Rule level:', errorRule)
console.log('Options:', errorOptions)
console.log('Complete config:', maxFileLinesError)

// Validate error configuration
if (
  errorRule === 'error' &&
  errorOptions.max === 100 &&
  errorOptions.skipBlankLines === true &&
  errorOptions.skipComments === true
) {
  console.log('✅ Error configuration is correct')
} else {
  console.log('❌ Error configuration is incorrect')
  process.exit(1)
}

console.log('\n✅ All max-file-lines configuration tests passed!')

// Test that the configurations are properly formatted for ESLint
console.log('\n📋 ESLint Configuration Format:')
console.log('Warning format:', JSON.stringify(maxFileLinesWarning))
console.log('Error format:', JSON.stringify(maxFileLinesError))

// Validate ESLint format
if (
  Array.isArray(maxFileLinesWarning) &&
  maxFileLinesWarning.length === 2 &&
  maxFileLinesWarning[0] === 'warn' &&
  typeof maxFileLinesWarning[1] === 'object'
) {
  console.log('✅ Warning ESLint format is correct')
} else {
  console.log('❌ Warning ESLint format is incorrect')
  process.exit(1)
}

if (
  Array.isArray(maxFileLinesError) &&
  maxFileLinesError.length === 2 &&
  maxFileLinesError[0] === 'error' &&
  typeof maxFileLinesError[1] === 'object'
) {
  console.log('✅ Error ESLint format is correct')
} else {
  console.log('❌ Error ESLint format is incorrect')
  process.exit(1)
}

console.log('\n🎉 All tests completed successfully!')
