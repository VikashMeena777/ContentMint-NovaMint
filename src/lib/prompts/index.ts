import type { ContentType, Platform, Tone } from "@/types";

interface PromptParams {
  topic: string;
  platform?: Platform;
  tone?: Tone;
  niche?: string;
  goal?: string;
  audience?: string;
  format?: string;
}

const SYSTEM_PROMPTS: Record<ContentType, string> = {
  hook: `You are a viral content expert who specializes in creating scroll-stopping hooks. Your hooks are proven to increase watch time and engagement by 300%+. You understand platform algorithms and human psychology deeply.`,

  caption: `You are a social media copywriting expert. You write captions that drive engagement, build community, and convert followers into customers. You understand each platform's unique culture and best practices.`,

  cta: `You are a conversion copywriting specialist. You create calls-to-action that compel immediate action using proven persuasion techniques including urgency, scarcity, social proof, and benefit-focused language.`,

  title: `You are a headline expert who has written viral titles for top publications and YouTube channels. You understand what makes people click while maintaining authenticity and delivering on the promise.`,

  idea: `You are a content strategist who identifies trending topics and angles before they go viral. You understand audience psychology, platform algorithms, and content-market fit deeply.`,
};

function buildUserPrompt(type: ContentType, params: PromptParams): string {
  const { topic, platform, tone, niche, goal, audience, format } = params;

  switch (type) {
    case "hook":
      return `Generate 8 scroll-stopping viral hooks for the following topic.

Topic: "${topic}"
${platform ? `Platform: ${platform}` : ""}
${tone ? `Tone: ${tone}` : ""}
${niche ? `Niche: ${niche}` : ""}

Requirements:
- Each hook should be 1-2 sentences max
- Create variety: question hooks, story hooks, contrarian hooks, stat hooks, curiosity gap hooks
- Optimized for the first 3 seconds of attention
- Include emojis where appropriate

Format your response as a JSON array of objects with "text" field for each hook. Example:
[{"text": "Hook 1 here"}, {"text": "Hook 2 here"}]

Return ONLY the JSON array, no other text.`;

    case "caption":
      return `Write 4 ${platform || "social media"} captions for the following topic.

Topic: "${topic}"
${platform ? `Platform: ${platform}` : ""}
${tone ? `Tone: ${tone}` : ""}

Requirements:
- Include relevant emojis
- Add 5-8 relevant hashtags at the end
- Include a compelling CTA
- ${platform === "twitter" ? "Keep under 280 characters" : "Optimize length for the platform"}
- Each caption should have a different angle/approach

Format your response as a JSON array of objects with "text" field for each caption. Example:
[{"text": "Caption 1 here"}, {"text": "Caption 2 here"}]

Return ONLY the JSON array, no other text.`;

    case "cta":
      return `Generate 8 compelling calls-to-action for the following.

Product/Service: "${topic}"
${goal ? `Goal: ${goal}` : ""}
${tone ? `Tone: ${tone}` : ""}

Requirements:
- Create variety: urgency CTAs, benefit CTAs, scarcity CTAs, social proof CTAs, curiosity CTAs
- Each CTA should be 1-2 sentences
- Include action verbs
- Some should include numbers/specifics
- Mix short punchy CTAs and slightly longer benefit-driven ones

Format your response as a JSON array of objects with "text" field for each CTA. Example:
[{"text": "CTA 1 here"}, {"text": "CTA 2 here"}]

Return ONLY the JSON array, no other text.`;

    case "title":
      return `Generate 10 click-worthy titles for the following.

Topic: "${topic}"
${platform ? `Platform: ${platform}` : ""}
${tone ? `Tone: ${tone}` : ""}
${format ? `Content Format: ${format}` : ""}

Requirements:
- Mix styles: how-to, listicle, contrarian, question, number-based
- Optimize for CTR (click-through rate)
- Include power words
- Some with brackets [2025] or parentheses (Step-by-Step)
- Each title should take a different angle

Format your response as a JSON array of objects with "text" field for each title. Example:
[{"text": "Title 1 here"}, {"text": "Title 2 here"}]

Return ONLY the JSON array, no other text.`;

    case "idea":
      return `Generate 12 content ideas for the following.

Topic/Niche: "${topic}"
${niche ? `Specific Niche: ${niche}` : ""}
${audience ? `Target Audience: ${audience}` : ""}
${format ? `Content Format: ${format}` : ""}
${tone ? `Tone: ${tone}` : ""}

Requirements:
- Include trending angles and timely topics
- Mix evergreen and trending ideas
- Each idea should include a brief description (1-2 sentences)
- Consider what performs well algorithmically
- Include different content types/formats within the ideas

Format your response as a JSON array of objects with "text" field for each idea. Example:
[{"text": "Idea title — Brief description of the content angle"}, {"text": "Idea 2 here"}]

Return ONLY the JSON array, no other text.`;

    default:
      return `Generate content about: "${topic}"`;
  }
}

export function buildPrompt(
  type: ContentType,
  params: PromptParams
): { system: string; user: string } {
  return {
    system: SYSTEM_PROMPTS[type],
    user: buildUserPrompt(type, params),
  };
}
