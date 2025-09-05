// Test file for invalid className usage in JSX
// This file should trigger ERRORS for HTML elements without className attributes

import React, { Fragment } from 'react';

// Invalid cases - HTML elements without className attributes (should trigger errors)
export const InvalidComponentsWithoutClassName = () => {
  return (
    <div> {/* ERROR: HTML element without className */}
      <div>This div should trigger an error - no className</div> {/* ERROR */}
      <span>This span should trigger an error - no className</span> {/* ERROR */}
      <p>This paragraph should trigger an error - no className</p> {/* ERROR */}
      <button>This button should trigger an error - no className</button> {/* ERROR */}
      <input type="text" /> {/* ERROR */}
      <img src="test.jpg" alt="test" /> {/* ERROR */}
      <h1>This heading should trigger an error - no className</h1> {/* ERROR */}
      <h2>This heading should trigger an error - no className</h2> {/* ERROR */}
      <section>This section should trigger an error - no className</section> {/* ERROR */}
      <article>This article should trigger an error - no className</article> {/* ERROR */}
      <nav>This nav should trigger an error - no className</nav> {/* ERROR */}
      <header>This header should trigger an error - no className</header> {/* ERROR */}
      <footer>This footer should trigger an error - no className</footer> {/* ERROR */}
      <main>This main should trigger an error - no className</main> {/* ERROR */}
      <aside>This aside should trigger an error - no className</aside> {/* ERROR */}
      <form>This form should trigger an error - no className</form> {/* ERROR */}
      <label>This label should trigger an error - no className</label> {/* ERROR */}
      <textarea>This textarea should trigger an error - no className</textarea> {/* ERROR */}
      <select>This select should trigger an error - no className</select> {/* ERROR */}
      <option value="test">This option should trigger an error - no className</option> {/* ERROR */}
      <ul>This ul should trigger an error - no className</ul> {/* ERROR */}
      <ol>This ol should trigger an error - no className</ol> {/* ERROR */}
      <li>This li should trigger an error - no className</li> {/* ERROR */}
      <table>This table should trigger an error - no className</table> {/* ERROR */}
      <thead>This thead should trigger an error - no className</thead> {/* ERROR */}
      <tbody>This tbody should trigger an error - no className</tbody> {/* ERROR */}
      <tr>This tr should trigger an error - no className</tr> {/* ERROR */}
      <td>This td should trigger an error - no className</td> {/* ERROR */}
      <th>This th should trigger an error - no className</th> {/* ERROR */}
      
      {/* React components should NOT trigger errors */}
      <CustomComponent>Custom components are ignored</CustomComponent>
      <AnotherComponent>
        <div>But nested HTML elements still trigger errors - no className</div> {/* ERROR */}
      </AnotherComponent>
      
      {/* Fragments should NOT trigger errors */}
      <Fragment>
        <div>But elements inside fragments still need className - no className</div> {/* ERROR */}
      </Fragment>
      <>
        <span>Elements in empty fragments also need className - no className</span> {/* ERROR */}
      </>
    </div>
  );
};

// Mixed valid and invalid cases
export const MixedValidInvalid = () => {
  return (
    <div className="container"> {/* VALID: has className */}
      <div className="with-class">This div has a className - should be fine</div> {/* VALID */}
      <div>This div has no className - should trigger error</div> {/* ERROR */}
      
      <CustomComponent>
        <div className="nested-with-class">Nested with className - should be fine</div> {/* VALID */}
        <div>Nested without className - should trigger error</div> {/* ERROR */}
      </CustomComponent>
      
      <section className="valid-section"> {/* VALID */}
        <p>This paragraph has no className - should trigger error</p> {/* ERROR */}
        <p className="valid-paragraph">This paragraph is valid</p> {/* VALID */}
      </section>
    </div>
  );
};

// Custom components for testing
const CustomComponent = ({ children }) => (
  <div className="custom-wrapper">{children}</div>
);

const AnotherComponent = ({ children }) => (
  <span className="another-wrapper">{children}</span>
);