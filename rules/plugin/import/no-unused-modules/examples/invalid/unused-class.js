// Invalid: This class export is never imported by any other module
export class UnusedClass {
  method() {
    return 'This class is never instantiated'
  }
}
