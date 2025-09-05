import React from 'react';

interface Props {
  name: string;
  age?: number;
}

function ValidComponent({ name, age }: Props) {
  const greeting = `Hello, ${name}!`;

  if (age !== undefined && age !== null) {
    return <div className="greeting">{greeting} You are {age} years old.</div>;
  }

  return <div className="greeting">{greeting}</div>;
}

export { ValidComponent };