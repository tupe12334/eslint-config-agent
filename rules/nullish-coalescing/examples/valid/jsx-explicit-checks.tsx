// Valid: Explicit null/undefined checks in JSX/TSX
import React from 'react';

interface Props {
  title?: string;
  description?: string;
  count?: number;
}

export function Component({ title, description, count }: Props): JSX.Element {
  return (
    <div className="component">
      {/* Valid: explicit undefined checks in JSX */}
      <h1 className="title">{title !== undefined ? title : 'Default Title'}</h1>
      <p className="description">{description !== undefined ? description : 'No description available'}</p>
      <span className="count">Count: {count !== undefined ? count : 0}</span>

      {/* Valid: explicit checks for conditional rendering */}
      {title !== undefined && title !== null && <div className="has-title">Has title</div>}
    </div>
  );
}

interface ComponentData {
  value?: string;
}

function ConditionalComponent({ data }: { data?: ComponentData }): JSX.Element {
  // Valid: explicit check with conditional assignment
  let displayValue: string;
  if (data && data.value !== null && data.value !== undefined) {
    displayValue = data.value;
  } else {
    displayValue = 'No data';
  }

  return (
    <div className="conditional">
      <span className="value">{displayValue}</span>
    </div>
  );
}

// Valid: using helper functions in components
function UserProfile({ user }: { user?: { name?: string; email?: string } }): JSX.Element {
  const getUserName = (): string => {
    if (user && user.name !== null && user.name !== undefined) {
      return user.name;
    }
    return 'Anonymous';
  };

  const getUserEmail = (): string => {
    if (user && user.email !== null && user.email !== undefined) {
      return user.email;
    }
    return 'No email provided';
  };

  return (
    <div className="user-profile">
      <h2 className="name">{getUserName()}</h2>
      <p className="email">{getUserEmail()}</p>
    </div>
  );
}