// This file should trigger ERRORS for HTML elements without className, even inside React components
import React, { Fragment } from 'react';

// Test React.* components - the components themselves should not error, but HTML elements inside should
export const InvalidReactComponents = () => {
  return (
    <div className="container">
      {/* React.Fragment - fragment OK, but HTML elements inside need className */}
      <React.Fragment>
        <div>Invalid div - no className</div> {/* ERROR */}
        <span>Invalid span - no className</span> {/* ERROR */}
      </React.Fragment>

      {/* React.StrictMode - component OK, but HTML elements inside need className */}
      <React.StrictMode>
        <section>Invalid section - no className</section> {/* ERROR */}
        <article>Invalid article - no className</article> {/* ERROR */}
      </React.StrictMode>

      {/* React.Suspense - component OK, but HTML elements inside need className */}
      <React.Suspense fallback={<div>Invalid fallback - no className</div>}> {/* ERROR */}
        <p>Invalid paragraph - no className</p> {/* ERROR */}
      </React.Suspense>

      {/* React.Profiler - component OK, but HTML elements inside need className */}
      <React.Profiler id="test" onRender={() => {}}>
        <h1>Invalid heading - no className</h1> {/* ERROR */}
        <ul>Invalid list - no className</ul> {/* ERROR */}
      </React.Profiler>
    </div>
  );
};

// Test imported Fragment - fragment OK, but HTML elements inside need className
export const InvalidFragment = () => {
  return (
    <Fragment>
      <div>Invalid div in fragment - no className</div> {/* ERROR */}
      <Fragment>
        <p>Invalid nested paragraph - no className</p> {/* ERROR */}
        <span>Invalid nested span - no className</span> {/* ERROR */}
      </Fragment>
    </Fragment>
  );
};

// Test empty fragments - fragments OK, but HTML elements inside need className
export const InvalidEmptyFragments = () => {
  return (
    <>
      <div>Invalid div in empty fragment - no className</div> {/* ERROR */}
      <>
        <section>Invalid nested section - no className</section> {/* ERROR */}
        <article>Invalid nested article - no className</article> {/* ERROR */}
      </>
    </>
  );
};

// Test custom components - components OK, but HTML elements inside need className
export const InvalidCustomComponents = () => {
  const CustomComponent = ({ children }: { children: React.ReactNode }) => children;
  const AnotherComponent = ({ children }: { children: React.ReactNode }) => children;

  return (
    <div className="custom-container">
      <CustomComponent>
        <p>Invalid paragraph in custom component - no className</p> {/* ERROR */}
        <span>Invalid span in custom component - no className</span> {/* ERROR */}
      </CustomComponent>

      <AnotherComponent>
        <section>Invalid section in another component - no className</section> {/* ERROR */}
        <div>Invalid div in another component - no className</div> {/* ERROR */}
      </AnotherComponent>
    </div>
  );
};

// Test mixed valid/invalid cases
export const MixedValidInvalid = () => {
  return (
    <div className="mixed-container">
      <React.Fragment>
        <div className="valid">This div has className - valid</div>
        <span>This span has no className - invalid</span> {/* ERROR */}
      </React.Fragment>

      <React.StrictMode>
        <p className="valid">This paragraph has className - valid</p>
        <article>This article has no className - invalid</article> {/* ERROR */}
      </React.StrictMode>
    </div>
  );
};