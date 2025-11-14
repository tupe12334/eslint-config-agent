// Valid: Class export is used by other modules
export class DataProcessor {
  process(data) {
    return data.map(item => item.value)
  }
}
