// Invalid: Function parameters and return types with inline unions

function handleEvent(type: "click" | "hover" | "focus") {
  console.log(type);
}

function getStatus(): "active" | "inactive" | "pending" {
  return "active";
}

const arrowHandler = (mode: "light" | "dark") => {
  console.log(mode);
};

const getMode = (): "light" | "dark" => "light";

interface InvalidMethodInterface {
  process(param: string | number): void;
}

export { handleEvent, getStatus, InvalidMethodInterface };