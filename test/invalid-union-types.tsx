// Test file for the new union type rule - these should trigger errors

interface BadInterface {
  // This should trigger the rule
  reason: "question_completed" | "context_changed" | "manual_refresh";

  // This should also trigger the rule
  status: "pending" | "success" | "error";

  // This should trigger the rule too
  mode: "light" | "dark";
}

type BadType = {
  // This should trigger the rule
  category: "urgent" | "normal" | "low";
};

// Function parameter with inline union - should trigger rule
function handleEvent(type: "click" | "hover" | "focus") {
  console.log(type);
}

// Arrow function parameter - should also trigger rule
const arrowHandler = (mode: "light" | "dark") => {
  console.log(mode);
};
