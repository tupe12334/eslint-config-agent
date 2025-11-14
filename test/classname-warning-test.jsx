// Test file for className warning rule in JavaScript/JSX
// This file tests that UI elements without className attributes generate warnings in .jsx files

import React from 'react'

// Valid cases - should NOT trigger warnings
const ValidComponentsWithClassName = () => {
  return (
    <div>
      <div className="container">Valid div with className</div>
      <span className="text">Valid span with className</span>
      <p className="paragraph">Valid paragraph with className</p>
      <button className="btn">Valid button with className</button>
      <input className="input" type="text" />
      <img className="image" src="test.jpg" alt="test" />
      <CustomComponent prop="value">
        Custom components should be ignored
      </CustomComponent>
    </div>
  )
}

// Invalid cases - should trigger warnings
const InvalidComponentsWithoutClassName = () => {
  return (
    <div>
      <div>This div should trigger a warning - no className</div>
      <span>This span should trigger a warning - no className</span>
      <p>This paragraph should trigger a warning - no className</p>
      <button>This button should trigger a warning - no className</button>
      <input type="text" />
      <img src="test.jpg" alt="test" />
      <h1>This heading should trigger a warning - no className</h1>
      <section>This section should trigger a warning - no className</section>
      <form>This form should trigger a warning - no className</form>
      <ul>This ul should trigger a warning - no className</ul>
      <li>This li should trigger a warning - no className</li>
    </div>
  )
}

// Mixed cases
const MixedComponents = () => {
  return (
    <div className="container">
      <div className="with-class">
        This div has a className - should be fine
      </div>
      <div>This div has no className - should trigger warning</div>
      <CustomComponent>
        <div className="nested-with-class">
          Nested with className - should be fine
        </div>
        <div>Nested without className - should trigger warning</div>
      </CustomComponent>
    </div>
  )
}

export {
  ValidComponentsWithClassName,
  InvalidComponentsWithoutClassName,
  MixedComponents,
}
