// Examples of code that violate the switch case explicit return rule

// Empty return statements in switch cases
function processAction(action) {
  switch (action) {
    case 'skip':
      return // Empty return - not allowed
    case 'process':
      return 'processed'
  }
}

// Empty return in block statements within switch cases
function handleWithBlocks(type) {
  switch (type) {
    case 'early': {
      if (someCondition) {
        return // Empty return in block - not allowed
      }
      return 'completed'
    }
    case 'normal':
      return 'done'
  }
}

// Multiple empty returns in different cases
function multipleEmptyReturns(status) {
  switch (status) {
    case 'pending':
      return // Empty return - not allowed
    case 'cancelled':
      return // Empty return - not allowed
    case 'completed':
      return 'finished'
  }
}

// Empty return in nested block statement
function nestedBlocks(operation) {
  switch (operation) {
    case 'complex': {
      const result = doSomething()
      if (result.failed) {
        return // Empty return in nested block - not allowed
      }
      return result.value
    }
  }
}

// Mixed empty and explicit returns
function mixedReturns(input) {
  switch (input.type) {
    case 'error':
      return // Empty return - not allowed
    case 'success':
      return input.data
    case 'warning':
      return // Empty return - not allowed
    default:
      return 'unknown'
  }
}

// Early return in switch case
function earlyReturn(condition, value) {
  switch (condition) {
    case 'validate':
      if (!value) {
        return // Empty return for early exit - not allowed
      }
      return processValue(value)
    case 'skip':
      return 'skipped'
  }
}

// Empty return in switch with complex logic
function complexSwitchLogic(action) {
  switch (action.type) {
    case 'RESET': {
      resetState()
      return // Empty return after side effect - not allowed
    }
    case 'UPDATE': {
      updateState(action.payload)
      return action.payload
    }
  }
}
