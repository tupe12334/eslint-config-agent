/**
 * Fixture: the private `timeout` member is assigned only in the constructor and
 * never reassigned, so the shipped prefer-readonly rule must flag it (it should
 * be declared readonly). This file is expected to report exactly one error.
 */
export class MutableConfig {
  private timeout: number

  public constructor(timeout: number) {
    this.timeout = timeout
  }

  public getTimeout(): number {
    return this.timeout
  }
}
