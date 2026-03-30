/** Shared plan configuration — single source of truth */

export interface PlanConfig {
  dailyLimit: number;
  maxFavorites: number;
  historyDays: number; // 0 = forever
  toneCount: number;
  canExport: boolean;
  priorityGeneration: boolean;
}

export const PLAN_CONFIG: Record<string, PlanConfig> = {
  free: {
    dailyLimit: 10,
    maxFavorites: 20,
    historyDays: 7,
    toneCount: 3,
    canExport: false,
    priorityGeneration: false,
  },
  pro: {
    dailyLimit: 100,
    maxFavorites: 200,
    historyDays: 90,
    toneCount: 10,
    canExport: true,
    priorityGeneration: true,
  },
  business: {
    dailyLimit: Infinity,
    maxFavorites: Infinity,
    historyDays: 0,
    toneCount: 10,
    canExport: true,
    priorityGeneration: true,
  },
};

/** Backward-compat: daily credit limits only */
export const PLAN_LIMITS: Record<string, number> = {
  free: PLAN_CONFIG.free.dailyLimit,
  pro: PLAN_CONFIG.pro.dailyLimit,
  business: PLAN_CONFIG.business.dailyLimit,
};

/** Display-friendly credit limit string */
export function formatCreditLimit(plan: string): string {
  const limit = PLAN_LIMITS[plan] || 10;
  return limit === Infinity ? "∞" : String(limit);
}

/** Get config for a plan, defaulting to free */
export function getPlanConfig(plan: string): PlanConfig {
  return PLAN_CONFIG[plan] || PLAN_CONFIG.free;
}
