import React from 'react'

// This should trigger react/jsx-filename-extension error (JSX in .js file)
function ComponentInJsFile() {
  return <div>This should cause an error</div>
}

export default ComponentInJsFile
