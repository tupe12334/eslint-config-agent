import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Valid React hooks usage
function ValidHooksComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Valid useEffect
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  // Valid useCallback
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // Valid useMemo
  const expensiveValue = useMemo(() => {
    return count * 2;
  }, [count]);

  return (
    <div>
      <h1>Count: {count}</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleIncrement}>Increment</button>
      <p>Expensive value: {expensiveValue}</p>
    </div>
  );
}

// Invalid hooks usage that should trigger react-hooks warnings/errors
function InvalidHooksComponent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<string[]>([]);

  // Missing dependency in useEffect (should trigger react-hooks/exhaustive-deps)
  useEffect(() => {
    console.log(count, items.length);
  }, []); // Missing count and items in dependency array

  // Hook in conditional (should trigger react-hooks/rules-of-hooks)
  if (count > 5) {
    const [conditionalState] = useState('bad'); // This should error
  }

  // Missing dependency in useCallback
  const handleClick = useCallback(() => {
    setCount(count + 1); // Should use functional update or include count in deps
  }, []); // Missing count dependency

  // Missing dependency in useMemo
  const derivedValue = useMemo(() => {
    return count * items.length;
  }, [count]); // Missing items dependency

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleClick}>Click</button>
      <p>{derivedValue}</p>
    </div>
  );
}

// Custom hook testing
function useCustomHook(initialValue: number) {
  const [value, setValue] = useState(initialValue);
  
  // Valid custom hook with proper dependencies
  const doubleValue = useMemo(() => value * 2, [value]);
  
  const increment = useCallback(() => {
    setValue(prev => prev + 1);
  }, []);

  return { value, doubleValue, increment };
}

// Component using custom hook
function ComponentWithCustomHook() {
  const { value, doubleValue, increment } = useCustomHook(0);
  
  return (
    <div>
      <p>Value: {value}</p>
      <p>Double: {doubleValue}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export { ValidHooksComponent, InvalidHooksComponent, ComponentWithCustomHook };