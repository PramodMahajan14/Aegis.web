/**
 * Request/response payload encryption hook point.
 *
 * Disabled by default — encryptPayload/decryptPayload are no-ops, so nothing
 * changes until a backend actually requires encrypted bodies. To turn it on:
 * flip ENCRYPTION_ENABLED and implement the two functions below (e.g. AES via
 * a library like crypto-js), keyed however the target server expects.
 */

export const ENCRYPTION_ENABLED = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function encryptPayload(data: any): any {
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decryptPayload(data: any): any {
  return data;
}
