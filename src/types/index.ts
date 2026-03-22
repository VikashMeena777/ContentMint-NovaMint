/* ========================================
   ContentMint — TypeScript Types
   ======================================== */

export type ContentType = "hook" | "caption" | "cta" | "title" | "idea";

export type Tier = "free" | "pro" | "business";

export type Platform =
  | "instagram"
  | "twitter"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "blog"
  | "general";

export type Tone =
  | "professional"
  | "casual"
  | "witty"
  | "inspirational"
  | "educational"
  | "controversial"
  | "storytelling";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: "free" | "pro" | "business";
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface GenerationInput {
  topic: string;
  platform?: Platform;
  tone?: Tone;
  niche?: string;
  charLimit?: number;
  format?: string;
  audience?: string;
  goal?: string;
  context?: string;
  contentFormat?: string;
}

export interface GenerationResult {
  id?: string;
  text: string;
  score?: number;
}

export interface Generation {
  id: string;
  user_id: string;
  type: ContentType;
  input: GenerationInput;
  output: { results: GenerationResult[] };
  viral_score: number | null;
  is_favorite: boolean;
  created_at: string;
}

export interface GeneratorConfig {
  type: ContentType;
  title: string;
  description: string;
  icon: string;
  placeholder: string;
  fields: GeneratorField[];
}

export interface GeneratorField {
  name: string;
  label: string;
  type: "text" | "select" | "textarea";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

/** Tier limits for daily generation count */
export const TIER_LIMITS: Record<Tier, number> = {
  free: 10,
  pro: 100,
  business: Infinity,
};

/** Platform display names */
export const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "blog", label: "Blog" },
  { value: "general", label: "General" },
];

/** Tone options */
export const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "witty", label: "Witty" },
  { value: "inspirational", label: "Inspirational" },
  { value: "educational", label: "Educational" },
  { value: "controversial", label: "Controversial" },
  { value: "storytelling", label: "Storytelling" },
];
