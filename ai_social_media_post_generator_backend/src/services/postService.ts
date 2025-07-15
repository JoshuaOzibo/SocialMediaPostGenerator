import supabase  from '../lib/config/supabaseClient';
import { Post } from '../types/post';

export async function createPost(post: Omit<Post, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data as Post;
}
