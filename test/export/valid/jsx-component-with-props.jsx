// Test: JSX component with props type (should be valid - 2 exports)
export interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }) {
  return (
    <button className="btn" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}