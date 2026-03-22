/* ========================================
   Cashfree — Plan Definitions
   Single source of truth for pricing
   ======================================== */

export type PlanId = "free" | "pro" | "business";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  price: number; // INR per month, 0 for free
  dailyLimit: number;
  features: string[];
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    dailyLimit: 10,
    features: [
      "10 generations/day",
      "All 5 content types",
      "7-day history",
      "20 saved favorites",
      "3 tone presets",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 199,
    dailyLimit: 100,
    features: [
      "100 generations/day",
      "All 5 content types",
      "90-day history",
      "200 saved favorites",
      "10 tone presets",
      "Priority generation",
      "Export (CSV/TXT)",
    ],
  },
  business: {
    id: "business",
    name: "Business",
    price: 399,
    dailyLimit: Infinity,
    features: [
      "Unlimited generations",
      "All 5 content types",
      "Forever history",
      "Unlimited favorites",
      "Custom + 10 tone presets",
      "Bulk generation (up to 50)",
      "API access",
      "Priority generation",
      "Export (CSV/TXT)",
    ],
  },
};
