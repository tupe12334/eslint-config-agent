// Test file for the new union type rule - these should pass

// Good: Using named types
type ReasonType = 'question_completed' | 'context_changed' | 'manual_refresh';
type StatusType = 'pending' | 'success' | 'error';
type ModeType = 'light' | 'dark';
type CategoryType = 'urgent' | 'normal' | 'low';
type EventType = 'click' | 'hover' | 'focus';

interface GoodInterface {
  reason: ReasonType;
  status: StatusType;
  mode: ModeType;
}

type GoodType = {
  category: CategoryType;
}

// Function parameter with named type - should pass
function handleEvent(type: EventType) {
  console.log(type);
}

// Using primitive types should be fine
interface PrimitiveInterface {
  id: number;
  name: string;
  isActive: boolean;
}

// Generic types should be fine
interface GenericInterface<T> {
  data: T;
  items: T[];
}