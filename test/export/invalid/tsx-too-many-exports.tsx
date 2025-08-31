// Test: TSX with more than 2 exports (should be invalid)
export interface ButtonProps {
  label: string;
  onClick: () => void;
}

export type ButtonVariant = 'primary' | 'secondary';

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button className="btn" onClick={onClick}>
      {label}
    </button>
  );
};

export const BUTTON_VARIANTS = ['primary', 'secondary'] as const;