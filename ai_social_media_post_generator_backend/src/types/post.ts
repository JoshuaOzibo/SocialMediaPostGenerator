
export interface Post {
  id: string;
  user_id: string;
  platform: string; // e.g., 'twitter', 'facebook', 'instagram'
  tone: String
  input_bullets: string[];
  generated_posts: string[];
  hashtags: string[];
  images: string[];
  scheduled_at: string; // ISO Date String
  status: string; // e.g., 'draft', 'scheduled', 'published'
  created_at: string;
}
