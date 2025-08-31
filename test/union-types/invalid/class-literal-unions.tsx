// Invalid: Class properties with literal unions

class InvalidClass {
  status: "active" | "inactive" | "pending" = "active";
  visibility: "public" | "private" = "public";
  theme: "light" | "dark" | "auto" = "light";
}

export { InvalidClass };