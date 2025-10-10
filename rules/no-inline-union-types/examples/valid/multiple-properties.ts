// Valid: Multiple class properties using named union types

type Theme = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large';
type Layout = 'grid' | 'list';

// ✅ Multiple class properties with named types
export class UserSettings {
  theme: Theme;
  fontSize: FontSize;
  layout: Layout;
}
