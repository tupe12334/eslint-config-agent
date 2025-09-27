// Invalid: Nullish coalescing in JSX/TSX contexts
import React from 'react';

interface Props {
  title?: string;
  description?: string;
  count?: number;
}

export function Component({ title, description, count }: Props): JSX.Element {
  return (
    <div className="component">
      {/* Should trigger rule: ?? in JSX expressions */}
      <h1 className="title">{title ?? 'Default Title'}</h1>
      <p className="description">{description ?? 'No description available'}</p>
      <span className="count">Count: {count ?? 0}</span>

      {/* Should trigger rule: ?? in conditional rendering */}
      {(title ?? 'fallback') && <div className="has-title">Has title</div>}
    </div>
  );
}

interface ComponentData {
  value?: string;
}

function ConditionalComponent({ data }: { data?: ComponentData }): JSX.Element {
  // Should trigger rule: ?? in component logic (without optional chaining)
  const value = data && data.value;
  const displayValue = value ?? 'No data';

  return (
    <div className="conditional">
      <span className="value">{displayValue}</span>
    </div>
  );
}