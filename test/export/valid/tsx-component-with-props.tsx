// Test: TSX component with props interface (should be valid - 2 exports)
export interface CardProps {
  title: string;
  content: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, content, className = 'card' }) => {
  return (
    <div className={className}>
      <h3 className="card-title">{title}</h3>
      <p className="card-content">{content}</p>
    </div>
  );
};