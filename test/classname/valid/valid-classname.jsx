// Test file for valid className usage in JSX
// This file should have NO errors - all HTML elements have className attributes

import React, { Fragment } from 'react';

// Valid cases - all HTML elements have className attributes
export const ValidComponentsWithClassName = () => {
  return (
    <div className="container">
      <div className="content">Valid div with className</div>
      <span className="text">Valid span with className</span>
      <p className="paragraph">Valid paragraph with className</p>
      <button className="btn">Valid button with className</button>
      <input className="input" type="text" />
      <img className="image" src="test.jpg" alt="test" />
      <h1 className="title">Valid heading with className</h1>
      <h2 className="subtitle">Valid subtitle with className</h2>
      <section className="section">Valid section with className</section>
      <article className="article">Valid article with className</article>
      <nav className="navigation">Valid nav with className</nav>
      <header className="header">Valid header with className</header>
      <footer className="footer">Valid footer with className</footer>
      <main className="main">Valid main with className</main>
      <aside className="sidebar">Valid aside with className</aside>
      <form className="form">Valid form with className</form>
      <label className="label">Valid label with className</label>
      <textarea className="textarea">Valid textarea with className</textarea>
      <select className="select">Valid select with className</select>
      <option className="option" value="test">Valid option with className</option>
      <ul className="list">Valid ul with className</ul>
      <ol className="ordered-list">Valid ol with className</ol>
      <li className="list-item">Valid li with className</li>
      <table className="table">Valid table with className</table>
      <thead className="table-head">Valid thead with className</thead>
      <tbody className="table-body">Valid tbody with className</tbody>
      <tr className="table-row">Valid tr with className</tr>
      <td className="table-cell">Valid td with className</td>
      <th className="table-header-cell">Valid th with className</th>

      {/* React components should be ignored - no className required */}
      <CustomComponent prop="value">Custom components are ignored</CustomComponent>
      <AnotherComponent>
        <div className="nested">Nested elements still need className</div>
      </AnotherComponent>

      {/* Fragments should be ignored */}
      <Fragment>Fragment is ignored</Fragment>
      <>Empty fragment is ignored</>
    </div>
  );
};

// Edge cases that should be valid
export const EdgeCasesValid = () => {
  return (
    <div className="edge-cases">
      {/* Empty className should still count as having className attribute */}
      <div className="">Empty className should be valid</div>

      {/* Dynamic className values should be valid */}
      <div className={undefined}>Dynamic className (undefined) should be valid</div>
      <div className={null}>Dynamic className (null) should be valid</div>
      <div className={false}>Dynamic className (boolean) should be valid</div>
      <div className={0}>Dynamic className (number) should be valid</div>
      <div className={"dynamic"}>Dynamic className (string literal) should be valid</div>
      <div className={`template-${"test"}`}>Dynamic className (template literal) should be valid</div>

      {/* Conditional className should be valid */}
      <div className={"active"}>Conditional className should be valid</div>

      {/* Complex className expressions should be valid */}
      <div className={`base modifier extra`.trim()}>Complex className should be valid</div>
    </div>
  );
};

// Custom components for testing
const CustomComponent = ({ prop, children }) => (
  <div className="custom-component">{children}</div>
);

const AnotherComponent = ({ children }) => (
  <span className="another-component">{children}</span>
);