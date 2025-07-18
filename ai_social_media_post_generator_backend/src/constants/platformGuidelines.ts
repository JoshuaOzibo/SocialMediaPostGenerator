export const PLATFORM_GUIDELINES = {
  twitter: 'Keep posts under 280 characters. Use concise, impactful language. Include relevant hashtags.',
  facebook: 'Posts can be longer (1-3 paragraphs). Focus on storytelling and community engagement.',
  instagram: 'Visual-first platform. Include call-to-actions and relevant hashtags (up to 30).',
  linkedin: 'Professional tone. Focus on industry insights, thought leadership, and networking.',
  tiktok: 'Trendy and engaging. Use current slang and trends. Keep it fun and relatable.'
} as const;

export const TONE_GUIDELINES = {
  professional: 'Use formal language, industry terminology, and maintain credibility.',
  casual: 'Use conversational language, contractions, and friendly expressions.',
  humorous: 'Include wit, puns, or light-hearted humor while staying relevant.',
  formal: 'Use proper grammar, avoid contractions, and maintain a serious tone.',
  friendly: 'Warm and approachable language, use "you" and "we" frequently.',
  enthusiastic: 'Use exclamation marks, positive language, and energetic expressions.'
} as const;

export type Platform = keyof typeof PLATFORM_GUIDELINES;
export type Tone = keyof typeof TONE_GUIDELINES; 