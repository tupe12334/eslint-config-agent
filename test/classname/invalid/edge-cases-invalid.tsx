// Test file for invalid edge cases of className rule
// This file should trigger ERRORS for elements without className attributes

import React, { Fragment } from 'react';

// Edge case: SVG elements without className (should trigger errors)
export const InvalidSVGElements = () => {
  return (
    <div className="svg-container">
      <svg> {/* ERROR: no className */}
        <circle cx="50" cy="50" r="40" /> {/* ERROR: no className */}
        <rect x="10" y="10" width="30" height="30" /> {/* ERROR: no className */}
        <line x1="0" y1="0" x2="100" y2="100" /> {/* ERROR: no className */}
        <path d="M 10 10 L 90 90" /> {/* ERROR: no className */}
        <text x="50" y="50">SVG Text</text> {/* ERROR: no className */}
        <g> {/* ERROR: no className */}
          <circle cx="25" cy="25" r="20" /> {/* ERROR: no className */}
        </g>
      </svg>
    </div>
  );
};

// Edge case: Web Components without className (should trigger errors)
export const InvalidWebComponents = () => {
  return (
    <div className="web-components">
      <custom-element>Invalid custom element - no className</custom-element> {/* ERROR */}
      <my-component>Invalid my-component - no className</my-component> {/* ERROR */}
      <data-table>Invalid data-table - no className</data-table> {/* ERROR */}
    </div>
  );
};

// Edge case: HTML5 semantic elements without className (should trigger errors)
export const InvalidHTML5Elements = () => {
  return (
    <div className="html5-container">
      <main>Invalid main - no className</main> {/* ERROR */}
      <article>Invalid article - no className</article> {/* ERROR */}
      <section>Invalid section - no className</section> {/* ERROR */}
      <aside>Invalid aside - no className</aside> {/* ERROR */}
      <nav>Invalid nav - no className</nav> {/* ERROR */}
      <header>Invalid header - no className</header> {/* ERROR */}
      <footer>Invalid footer - no className</footer> {/* ERROR */}
      <figure> {/* ERROR */}
        <img src="test.jpg" alt="test" /> {/* ERROR */}
        <figcaption>Invalid figcaption - no className</figcaption> {/* ERROR */}
      </figure>
      <details> {/* ERROR */}
        <summary>Invalid summary - no className</summary> {/* ERROR */}
        <div>Details content - no className</div> {/* ERROR */}
      </details>
      <dialog>Invalid dialog - no className</dialog> {/* ERROR */}
      <time dateTime="2023-01-01">Invalid time - no className</time> {/* ERROR */}
      <mark>Invalid mark - no className</mark> {/* ERROR */}
      <progress value="50" max="100">Invalid progress - no className</progress> {/* ERROR */}
      <meter value="6" min="0" max="10">Invalid meter - no className</meter> {/* ERROR */}
    </div>
  );
};

// Custom component for testing
const CustomComponent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="custom-wrapper">{children}</div>
);