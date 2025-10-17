/**
 * Helper functions for e2e tests
 * Provides CI-friendly timeouts and utilities
 */

/**
 * Get timeout value adapted for CI environment
 * @param localTimeout - Timeout for local development
 * @param ciMultiplier - Multiplier for CI (default 3x)
 */
export function getTimeout(
  localTimeout: number,
  ciMultiplier: number = 3,
): number {
  return process.env.CI ? localTimeout * ciMultiplier : localTimeout;
}

/**
 * Get selector wait options with CI-friendly timeout
 * @param localTimeout - Base timeout in milliseconds
 */
export function getSelectorOptions(localTimeout: number = 5000) {
  return { timeout: getTimeout(localTimeout) };
}

/**
 * Wait for an appropriate amount of time based on environment
 * @param localMs - Milliseconds to wait locally
 */
export function getWaitTime(localMs: number): number {
  return getTimeout(localMs, 2); // Use 2x multiplier for wait times
}
