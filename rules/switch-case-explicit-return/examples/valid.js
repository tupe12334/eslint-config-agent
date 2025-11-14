// Examples of code that follow the switch case explicit return rule

// Explicit return values in all switch cases
function processAction(action) {
  switch (action) {
    case 'skip':
      return undefined // Explicit undefined instead of empty return
    case 'process':
      return 'processed'
  }
}

// Explicit returns in block statements
function handleWithBlocks(type) {
  switch (type) {
    case 'early': {
      if (someCondition) {
        return 'early-exit' // Explicit return value
      }
      return 'completed'
    }
    case 'normal':
      return 'done'
  }
}

// Using explicit null returns
function findItem(id) {
  switch (id) {
    case 'unknown':
      return null // Explicit null instead of empty return
    case 'special':
      return getSpecialItem()
    default:
      return getItem(id)
  }
}

// Using break statements instead of returns for control flow
function processWithBreak(action) {
  let result = 'default'

  switch (action) {
    case 'skip':
      result = 'skipped'
      break // Use break instead of empty return
    case 'process':
      result = 'processed'
      break
  }

  return result
}

// Explicit boolean returns
function validateInput(input) {
  switch (input.type) {
    case 'invalid':
      return false // Explicit boolean instead of empty return
    case 'valid':
      return true
    default:
      return false
  }
}

// Explicit string returns with meaningful values
function getStatusMessage(status) {
  switch (status) {
    case 'loading':
      return 'Please wait...'
    case 'error':
      return 'Something went wrong' // Explicit error message
    case 'success':
      return 'Operation completed'
    default:
      return 'Unknown status'
  }
}

// Complex returns with explicit values
function processComplexAction(action) {
  switch (action.type) {
    case 'RESET': {
      resetState()
      return { status: 'reset', timestamp: Date.now() } // Explicit object return
    }
    case 'UPDATE': {
      updateState(action.payload)
      return { status: 'updated', data: action.payload }
    }
    default:
      return { status: 'unknown', data: null }
  }
}

// Returning promises explicitly
async function handleAsyncAction(action) {
  switch (action.type) {
    case 'fetch':
      return Promise.resolve(action.data) // Explicit promise return
    case 'error':
      return Promise.reject(new Error(action.message))
    default:
      return Promise.resolve(null)
  }
}

// Functions without switch statements (rule doesn't apply)
function simpleFunction(value) {
  if (value) {
    return // Empty return outside switch is allowed
  }
  return 'default'
}

// Switch statements without return statements (rule doesn't apply)
function switchWithoutReturns(action) {
  switch (action) {
    case 'log':
      console.log('Action logged')
      break
    case 'save':
      saveData()
      break
  }
}
