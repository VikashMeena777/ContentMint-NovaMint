/** Shared plan configuration — single source of truth */

export const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  pro: 100,
  business: Infinity,
};

/** Display-friendly credit limit string */
export function formatCreditLimit(plan: string): string {
  const limit = PLAN_LIMITS[plan] || 10;
  return limit === Infinity ? "∞" : String(limit);
}
