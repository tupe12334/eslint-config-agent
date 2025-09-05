// Test file for valid edge cases of className rule
// This file should have NO errors - all elements have className attributes

import React, { Fragment } from 'react';

// Edge case: SVG elements with className (should be valid)
export const ValidSVGElements = () => {
  return (
    <div className="svg-container">
      <svg className="svg-element" width="100" height="100">
        <circle className="circle" cx="50" cy="50" r="40" />
        <rect className="rect" x="10" y="10" width="30" height="30" />
        <line className="line" x1="0" y1="0" x2="100" y2="100" />
        <path className="path" d="M 10 10 L 90 90" />
        <text className="text" x="50" y="50">SVG Text</text>
        <g className="group">
          <circle className="nested-circle" cx="25" cy="25" r="20" />
        </g>
      </svg>
    </div>
  );
};

// Edge case: Web Components with className (should be valid)
export const ValidWebComponents = () => {
  return (
    <div className="web-components">
      <custom-element className="custom">Valid custom element with className</custom-element>
      <my-component className="my-comp">Valid my-component with className</my-component>
      <data-table className="table">Valid data-table with className</data-table>
    </div>
  );
};

// Edge case: HTML5 semantic elements with className (should be valid)
export const ValidHTML5Elements = () => {
  return (
    <div className="html5-container">
      <main className="main-content">Valid main with className</main>
      <article className="article-content">Valid article with className</article>
      <section className="section-content">Valid section with className</section>
      <aside className="sidebar-content">Valid aside with className</aside>
      <nav className="navigation">Valid nav with className</nav>
      <header className="page-header">Valid header with className</header>
      <footer className="page-footer">Valid footer with className</footer>
      <figure className="figure-element">
        <img className="figure-image" src="test.jpg" alt="test" />
        <figcaption className="figure-caption">Valid figcaption with className</figcaption>
      </figure>
      <details className="details-element">
        <summary className="details-summary">Valid summary with className</summary>
        <div className="details-content">Details content</div>
      </details>
      <dialog className="modal">Valid dialog with className</dialog>
      <time className="timestamp" dateTime="2023-01-01">Valid time with className</time>
      <mark className="highlight">Valid mark with className</mark>
      <progress className="progress-bar" value="50" max="100">Valid progress with className</progress>
      <meter className="meter-element" value="6" min="0" max="10">Valid meter with className</meter>
    </div>
  );
};

// Custom component for testing
const CustomComponent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="custom-wrapper">{children}</div>
);