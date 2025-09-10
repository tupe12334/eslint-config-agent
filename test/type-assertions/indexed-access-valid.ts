// Test file for valid patterns that should not trigger the indexed access restriction
// These patterns demonstrate the recommended approach

const locales = ["en", "es", "fr"] as const;

// Valid: Define a named type first
type Locale = (typeof locales)[number];
type LocaleUnion = "en" | "es" | "fr";

// Valid: Use the named types (though general as restriction still applies)
const locale1: Locale = "en";
const locale2: LocaleUnion = "es";

// Valid: Direct assignment without type assertion
const locale3 = "fr"; // inferred as string

// Valid: Using as const (allowed exception)
const localeArray = ["en", "es", "fr"] as const;

// Valid: Function parameter with proper typing
function setLocale(locale: Locale): void {
  console.log(locale);
}

// Valid: Type guard function
function isValidLocale(value: string): value is Locale {
  const validLocales: string[] = ["en", "es", "fr"];
  return validLocales.includes(value);
}

// Export to avoid unused variable errors
export { locale1, locale2, locale3, localeArray, setLocale, isValidLocale };
export type { Locale, LocaleUnion };
