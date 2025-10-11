import React from 'react';

interface Props {
  name: string;
  age?: number;
}

function ValidComponent({ name, age }: Props) {
  if (age !== undefined && age !== null) {
    const greeting = `Hello, ${name}!`;
    return <div className="greeting">{greeting} You are {age} years old.</div>;
  }

  const greeting = `Hello, ${name}!`;
  return <div className="greeting">{greeting}</div>;
}

export { ValidComponent };