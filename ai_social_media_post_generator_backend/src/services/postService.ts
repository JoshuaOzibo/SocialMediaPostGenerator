import supabase from '../lib/config/supabaseClient.js';
import { Post, CreatePostRequest, UpdatePostRequest, PostResponse, PostListResponse, PostFilters } from '../types/post.js';
import { contentGenerationService } from './contentGenerationService.js';
import { GeneratePostRequest } from '../types/ai.js';

export class PostService {
  /**
   * Create a new post with AI-generated content
   */
  async createPost(userId: string, request: CreatePostRequest): Promise<PostResponse> {
    try {
      // Generate AI content first
      const generateRequest: GeneratePostRequest = {
        inputBullets: request.input_bullets,
        platform: request.platform,
        tone: request.tone,
        additionalContext: request.additionalContext
      };

      const generatedPosts = await contentGenerationService.generatePosts(generateRequest);
      
      // Extract content and hashtags
      const generatedContent = generatedPosts.map(post => post.content);
      const allHashtags = generatedPosts.flatMap(post => post.hashtags);
      const imageSuggestions = generatedPosts.flatMap(post => post.imageSuggestions);

      // Create post data
      const postData: Omit<Post, 'id' | 'created_at' | 'updated_at'> = {
        user_id: userId,
        platform: request.platform,
        tone: request.tone,
        input_bullets: request.input_bullets,
        generated_posts: generatedContent,
        hashtags: allHashtags,
        images: imageSuggestions,
        scheduled_at: request.scheduled_at,
        status: 'draft'
      };

      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();

      if (error) throw error;
      
      return this.mapToPostResponse(data as Post);
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post');
    }
  }

  /**
   * Get a single post by ID
   */
  async getPostById(userId: string, postId: string): Promise<PostResponse> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Post not found');

      return this.mapToPostResponse(data as Post);
    } catch (error) {
      console.error('Error getting post:', error);
      throw new Error('Failed to get post');
    }
  }

  /**
   * Get posts with filtering and pagination
   */
  async getPosts(
    userId: string, 
    page: number = 1, 
    limit: number = 10, 
    filters: PostFilters = {}
  ): Promise<PostListResponse> {
    try {
      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // Apply filters
      if (filters.platform) {
        query = query.eq('platform', filters.platform);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.tone) {
        query = query.eq('tone', filters.tone);
      }
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      if (filters.search) {
        query = query.or(`input_bullets.cs.{${filters.search}},generated_posts.cs.{${filters.search}}`);
      }

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      // Order by created_at desc
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      const posts = (data || []).map(post => this.mapToPostResponse(post as Post));
      const total = count || 0;
      const hasMore = offset + limit < total;

      return {
        posts,
        total,
        page,
        limit,
        hasMore
      };
    } catch (error) {
      console.error('Error getting posts:', error);
      throw new Error('Failed to get posts');
    }
  }

  /**
   * Update a post
   */
  async updatePost(userId: string, postId: string, updates: UpdatePostRequest): Promise<PostResponse> {
    try {
      // Check if post exists and belongs to user
      const existingPost = await this.getPostById(userId, postId);
      if (!existingPost) {
        throw new Error('Post not found');
      }

      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', postId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return this.mapToPostResponse(data as Post);
    } catch (error) {
      console.error('Error updating post:', error);
      throw new Error('Failed to update post');
    }
  }

  /**
   * Regenerate content for an existing post
   */
  async regenerateContent(userId: string, postId: string): Promise<PostResponse> {
    try {
      // Get existing post
      const existingPost = await this.getPostById(userId, postId);
      if (!existingPost) {
        throw new Error('Post not found');
      }

      // Generate new content
      const generateRequest: GeneratePostRequest = {
        inputBullets: existingPost.input_bullets,
        platform: existingPost.platform,
        tone: existingPost.tone
      };

      const generatedPosts = await contentGenerationService.generatePosts(generateRequest);
      
      // Extract new content and hashtags
      const generatedContent = generatedPosts.map(post => post.content);
      const allHashtags = generatedPosts.flatMap(post => post.hashtags);
      const imageSuggestions = generatedPosts.flatMap(post => post.imageSuggestions);

      // Update post with new content
      const updates: UpdatePostRequest = {
        generated_posts: generatedContent,
        hashtags: allHashtags,
        images: imageSuggestions
      };

      return await this.updatePost(userId, postId, updates);
    } catch (error) {
      console.error('Error regenerating content:', error);
      throw new Error('Failed to regenerate content');
    }
  }

  /**
   * Delete a post
   */
  async deletePost(userId: string, postId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new Error('Failed to delete post');
    }
  }

  /**
   * Get post statistics for a user
   */
  async getPostStats(userId: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPlatform: Record<string, number>;
    byTone: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('status, platform, tone')
        .eq('user_id', userId);

      if (error) throw error;

      const posts = data || [];
      const total = posts.length;
      
      const byStatus = posts.reduce((acc, post) => {
        acc[post.status] = (acc[post.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byPlatform = posts.reduce((acc, post) => {
        acc[post.platform] = (acc[post.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byTone = posts.reduce((acc, post) => {
        acc[post.tone] = (acc[post.tone] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return { total, byStatus, byPlatform, byTone };
    } catch (error) {
      console.error('Error getting post stats:', error);
      throw new Error('Failed to get post statistics');
    }
  }

  /**
   * Map database post to response format
   */
  private mapToPostResponse(post: Post): PostResponse {
    return {
      id: post.id,
      platform: post.platform,
      tone: post.tone,
      input_bullets: post.input_bullets,
      generated_posts: post.generated_posts,
      hashtags: post.hashtags,
      images: post.images,
      scheduled_at: post.scheduled_at,
      status: post.status,
      created_at: post.created_at,
      updated_at: post.updated_at
    };
  }
}

// Export singleton instance
export const postService = new PostService();
