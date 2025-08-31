// Valid: Functions using named types for parameters and return types

type EventType = 'click' | 'hover' | 'focus';
type StatusType = 'pending' | 'success' | 'error';

function handleEvent(type: EventType): StatusType {
  console.log(type);
  return 'success';
}

const processEvent = (event: EventType): StatusType => {
  return 'pending';
};

export { handleEvent, processEvent };