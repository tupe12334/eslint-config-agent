// Test file for invalid form and fragment cases without className
// This file should trigger ERRORS for elements without className attributes

import React, { Fragment } from 'react';

// Edge case: Form elements without className (should trigger errors)
export const InvalidFormElements = () => {
  return (
    <form> {/* ERROR */}
      <fieldset> {/* ERROR */}
        <legend>Invalid legend - no className</legend> {/* ERROR */}
        <input type="text" /> {/* ERROR */}
        <input type="email" /> {/* ERROR */}
        <input type="password" /> {/* ERROR */}
        <input type="checkbox" /> {/* ERROR */}
        <input type="radio" /> {/* ERROR */}
        <input type="submit" /> {/* ERROR */}
        <textarea>Invalid textarea - no className</textarea> {/* ERROR */}
        <select> {/* ERROR */}
          <optgroup label="Group 1"> {/* ERROR */}
            <option value="1">Invalid option - no className</option> {/* ERROR */}
          </optgroup>
        </select>
        <button type="button">Invalid button - no className</button> {/* ERROR */}
        <label>Invalid label - no className</label> {/* ERROR */}
      </fieldset>
    </form>
  );
};

// Edge case: Elements in fragments and components without className (should trigger errors)
export const InvalidFragmentsAndComponents = () => {
  return (
    <div className="mixed-container">
      <Fragment>
        <div>Invalid div in Fragment - no className</div> {/* ERROR */}
        <CustomComponent>
          <span>Invalid span in component - no className</span> {/* ERROR */}
          <Fragment>
            <p>Invalid nested p in Fragment - no className</p> {/* ERROR */}
          </Fragment>
        </CustomComponent>
      </Fragment>

      <>
        <section>Invalid section in empty fragment - no className</section> {/* ERROR */}
        <Fragment>
          <article>Invalid deeply nested article - no className</article> {/* ERROR */}
        </Fragment>
      </>

      <CustomComponent>
        <>
          <div>Invalid div in complex nesting - no className</div> {/* ERROR */}
        </>
      </CustomComponent>
    </div>
  );
};

// Custom component for testing
const CustomComponent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="custom-wrapper">{children}</div>
);