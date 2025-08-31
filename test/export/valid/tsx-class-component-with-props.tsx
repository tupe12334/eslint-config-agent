// Test: TSX class component with props interface (should be valid - 2 exports)
export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export class Input extends React.Component<InputProps> {
  render() {
    const { value, onChange, placeholder } = this.props;

    return (
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    );
  }
}