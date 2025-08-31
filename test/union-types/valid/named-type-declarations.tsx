// Valid: Using named type declarations for literal unions

type StatusType = 'pending' | 'success' | 'error';
type ModeType = 'light' | 'dark';
type CategoryType = 'urgent' | 'normal' | 'low';

interface ValidInterface {
  status: StatusType;
  mode: ModeType;
  category: CategoryType;
}

export { StatusType, ValidInterface };