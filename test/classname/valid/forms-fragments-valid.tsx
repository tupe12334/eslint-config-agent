// Test file for valid form and fragment cases with className
// This file should have NO errors - all elements have className attributes

import React, { Fragment } from 'react';

// Edge case: Form elements with className (should be valid)
export const ValidFormElements = () => {
  return (
    <form className="form-container">
      <fieldset className="fieldset-element">
        <legend className="fieldset-legend">Valid legend with className</legend>
        <input className="text-input" type="text" />
        <input className="email-input" type="email" />
        <input className="password-input" type="password" />
        <input className="checkbox-input" type="checkbox" />
        <input className="radio-input" type="radio" />
        <input className="submit-button" type="submit" />
        <textarea className="textarea-element">Valid textarea with className</textarea>
        <select className="select-element">
          <optgroup className="option-group" label="Group 1">
            <option className="option-element" value="1">Valid option with className</option>
          </optgroup>
        </select>
        <button className="button-element" type="button">Valid button with className</button>
        <label className="label-element">Valid label with className</label>
      </fieldset>
    </form>
  );
};

// Edge case: React Fragments and components mixed with HTML elements (should be valid)
export const ValidFragmentsAndComponents = () => {
  return (
    <div className="mixed-container">
      <Fragment>
        <div className="valid-in-fragment">Valid div in Fragment with className</div>
        <CustomComponent>
          <span className="valid-in-component">Valid span in component with className</span>
          <Fragment>
            <p className="valid-nested">Valid nested p in Fragment with className</p>
          </Fragment>
        </CustomComponent>
      </Fragment>

      <>
        <section className="valid-in-empty-fragment">Valid section in empty fragment</section>
        <Fragment>
          <article className="deeply-nested">Valid deeply nested article</article>
        </Fragment>
      </>

      <CustomComponent>
        <>
          <div className="complex-nesting">Valid div in complex nesting</div>
        </>
      </CustomComponent>
    </div>
  );
};

// Custom component for testing
const CustomComponent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="custom-wrapper">{children}</div>
);