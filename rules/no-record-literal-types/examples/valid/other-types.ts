// Valid: Other type definitions that don't use Record with literals

// Tuple types
type Coordinates = [number, number];
type RGB = [red: number, green: number, blue: number];

// Function types
type EventHandler = (event: Event) => void;
type Validator<T> = (value: T) => boolean;

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

// Mapped types
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Intersection types
type Timestamped = {
  timestamp: Date;
};

type User = UserProfile & Timestamped;

// Arrays and collections
type UserList = UserProfile[];
type UserSet = Set<UserProfile>;
type UserMap = Map<string, UserProfile>;