// This file should have NO errors - React components should be excluded from className requirement
import React, { Fragment } from 'react';

// Test React.* components (should NOT trigger errors)
export const ValidReactComponents = () => {
  return (
    <div className="container">
      {/* React.Fragment */}
      <React.Fragment>
        <div className="content">Valid content with className</div>
      </React.Fragment>

      {/* React.StrictMode */}
      <React.StrictMode>
        <section className="strict-section">Valid section with className</section>
      </React.StrictMode>

      {/* React.Suspense */}
      <React.Suspense fallback={<div className="loading">Loading...</div>}>
        <article className="suspense-content">Valid article with className</article>
      </React.Suspense>

      {/* React.Profiler */}
      <React.Profiler id="test" onRender={() => {}}>
        <p className="profiler-content">Valid paragraph with className</p>
      </React.Profiler>

      {/* React.ErrorBoundary (if it exists) */}
      <React.Component>
        <span className="component-content">Valid span with className</span>
      </React.Component>
    </div>
  );
};

// Test imported Fragment (should NOT trigger errors)
export const ValidFragment = () => {
  return (
    <Fragment>
      <div className="fragment-content">Valid div with className</div>
      <Fragment>
        <p className="nested-fragment">Valid nested fragment content</p>
      </Fragment>
    </Fragment>
  );
};

// Test empty fragments (should NOT trigger errors)
export const ValidEmptyFragments = () => {
  return (
    <>
      <div className="empty-fragment-content">Valid content in empty fragment</div>
      <>
        <span className="nested-empty">Valid nested empty fragment</span>
      </>
    </>
  );
};

// Test custom components (should NOT trigger errors)
export const ValidCustomComponents = () => {
  const CustomComponent = ({ children }: { children: React.ReactNode }) => children;
  const AnotherComponent = ({ children }: { children: React.ReactNode }) => children;

  return (
    <div className="custom-container">
      <CustomComponent>
        <p className="custom-content">Valid content with className</p>
      </CustomComponent>

      <AnotherComponent>
        <section className="another-section">Valid section with className</section>
      </AnotherComponent>
    </div>
  );
};