/**
 * Fixture: the private `timeout` member is already declared readonly, so the
 * shipped prefer-readonly rule must stay silent. This file is expected to
 * report no errors.
 */
export class ReadonlyConfig {
  private readonly timeout: number

  public constructor(timeout: number) {
    this.timeout = timeout
  }

  public getTimeout(): number {
    return this.timeout
  }
}
