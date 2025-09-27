// Invalid: export type without from clause (local export)

interface ProgressAnalysis {
  status: string;
}

// This should trigger the new rule
export type { ProgressAnalysis };