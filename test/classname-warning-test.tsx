// Test file for className warning rule
// This file tests that UI elements without className attributes generate warnings

import React from 'react';

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
      <CustomComponent prop="value">Custom components should be ignored</CustomComponent>
      <Fragment>Fragment should be ignored</Fragment>
      <>Empty fragment should work</>
    </div>
  );
};

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
      <h2>This heading should trigger a warning - no className</h2>
      <section>This section should trigger a warning - no className</section>
      <article>This article should trigger a warning - no className</article>
      <nav>This nav should trigger a warning - no className</nav>
      <header>This header should trigger a warning - no className</header>
      <footer>This footer should trigger a warning - no className</footer>
      <main>This main should trigger a warning - no className</main>
      <aside>This aside should trigger a warning - no className</aside>
      <form>This form should trigger a warning - no className</form>
      <label>This label should trigger a warning - no className</label>
      <textarea>This textarea should trigger a warning - no className</textarea>
      <select>This select should trigger a warning - no className</select>
      <option value="test">This option should trigger a warning - no className</option>
      <ul>This ul should trigger a warning - no className</ul>
      <ol>This ol should trigger a warning - no className</ol>
      <li>This li should trigger a warning - no className</li>
      <table>This table should trigger a warning - no className</table>
      <thead>This thead should trigger a warning - no className</thead>
      <tbody>This tbody should trigger a warning - no className</tbody>
      <tr>This tr should trigger a warning - no className</tr>
      <td>This td should trigger a warning - no className</td>
      <th>This th should trigger a warning - no className</th>
    </div>
  );
};

// Mixed cases
const MixedComponents = () => {
  return (
    <div className="container">
      <div className="with-class">This div has a className - should be fine</div>
      <div>This div has no className - should trigger warning</div>
      <CustomComponent>
        <div className="nested-with-class">Nested with className - should be fine</div>
        <div>Nested without className - should trigger warning</div>
      </CustomComponent>
    </div>
  );
};

// Edge cases
const EdgeCases = () => {
  return (
    <div className="edge-cases">
      <div className="">Empty className should still count as having className attribute</div>
      <div className={undefined}>Dynamic className should still count</div>
      <div className={null}>Null className should still count</div>
      <div className={false}>Boolean className should still count</div>
      <div className={0}>Number className should still count</div>
      <div className={"dynamic"}>String literal className should count</div>
      <div className={`template-${true}`}>Template literal className should count</div>
    </div>
  );
};

export { ValidComponentsWithClassName, InvalidComponentsWithoutClassName, MixedComponents, EdgeCases };