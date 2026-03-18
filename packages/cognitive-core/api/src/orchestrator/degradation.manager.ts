export function degradeResponse<T extends object>(response: T, reason: string) {
  return {
    ...response,
    degraded: true,
    degradedReason: reason
  };
}
