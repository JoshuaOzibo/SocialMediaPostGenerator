import supabase from '../lib/config/supabaseClient.js';
import type { Post, CreatePostRequest, UpdatePostRequest, PostResponse, PostListResponse, PostFilters } from '../types/post.js';
import { contentGenerationService } from './contentGenerationService.js';
import type { PostGenerationRequest, ScheduledPost } from '../types/ai.js';

export class PostService {
  /**
   * Create a new post with AI-generated content
   */
  async createPost(request: CreatePostRequest): Promise<PostResponse> {
    try {
      // Generate AI content first
      const generateRequest: PostGenerationRequest = {
        inputBullets: request.input_bullets,
        platform: request.platform,
        tone: request.tone,
        additionalContext: request.additionalContext,
        days: request.days || 1,
        includeHashtags: request.includeHashtags !== false, // Default to true
        includeImages: request.includeImages !== false // Default to true
      };

      let generatedPosts;
      let scheduledPosts: ScheduledPost[] = [];

      // If scheduleDate is provided, generate scheduled posts
      if (request.scheduleDate) {
        scheduledPosts = await contentGenerationService.generateScheduledPosts(generateRequest, request.scheduleDate);
        generatedPosts = scheduledPosts.map(post => ({
          content: post.content,
          hashtags: post.hashtags,
          imageSuggestions: post.imageSuggestions,
          images: post.images
        }));
      } else {
        generatedPosts = await contentGenerationService.generatePosts(generateRequest);
      }
      
      // Extract content and hashtags
      const generatedContent = generatedPosts.map(post => post.content);
      const allHashtags = generatedPosts.flatMap(post => post.hashtags);
      const imageSuggestions = generatedPosts.flatMap(post => post.imageSuggestions);
      const allImages = generatedPosts.flatMap(post => post.images || []);

      // Create individual post data with their own hashtags and images
      const individualPosts = generatedPosts.map((post, index) => ({
        id: `post_${Date.now()}_${index}`, // Generate unique ID for each individual post
        content: post.content,
        hashtags: post.hashtags,
        images: post.imageSuggestions,
        image_metadata: post.images || [],
        day_number: index + 1,
        posting_date: request.scheduleDate ? 
          new Date(new Date(request.scheduleDate).getTime() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : 
          undefined
      }));

      // Create post data
      const postData: Omit<Post, 'id' | 'created_at' | 'updated_at'> = {
        user_id: request.user_id,
        platform: request.platform,
        tone: request.tone,
        input_bullets: request.input_bullets,
        generated_posts: generatedContent,
        hashtags: allHashtags,
        images: imageSuggestions,
        image_metadata: allImages,
        individual_posts: individualPosts,
        include_hashtags: request.includeHashtags,
        include_images: request.includeImages,
        days: request.days,
        additional_context: request.additionalContext,
        scheduled_at: request.scheduled_at,
        status: 'draft'
      };

      console.log('Attempting to save post data:', JSON.stringify(postData, null, 2));
      
      let data;
      try {
        const result = await supabase
          .from('posts')
          .insert(postData)
          .select()
          .single();

        data = result.data;
        console.log('Supabase response data:', data);
        console.log('Supabase response error:', result.error);

        if (result.error) {
          console.error('Supabase error details:', {
            message: result.error.message,
            details: result.error.details,
            hint: result.error.hint,
            code: result.error.code
          });
          throw result.error;
        }

        if (!data) {
          throw new Error('No data returned from Supabase insert');
        }
      } catch (supabaseError) {
        console.error('Supabase operation failed:', supabaseError);
        throw supabaseError;
      }
      
      // If we have scheduled posts, create individual scheduled post records
      if (scheduledPosts.length > 0) {
        await this.createScheduledPostRecords(request.user_id, data.id, scheduledPosts, request);
      }
      
      return this.mapToPostResponse(data as Post);
    } catch (error) {
      console.error('Error creating post:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        const errorMessage = typeof error === 'object' && error !== null 
          ? JSON.stringify(error, null, 2) 
          : String(error);
        throw new Error(`Failed to create post: ${errorMessage}`);
      }
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
   * Get scheduled posts with pagination
   */
  async getScheduledPosts(
    userId: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{
    scheduledPosts: any[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    try {
      let query = supabase
        .from('scheduled_posts')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('posting_date', { ascending: true });

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      const scheduledPosts = data || [];
      const total = count || 0;
      const hasMore = offset + limit < total;

      return {
        scheduledPosts,
        total,
        page,
        limit,
        hasMore
      };
    } catch (error) {
      console.error('Error getting scheduled posts:', error);
      throw new Error('Failed to get scheduled posts');
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
   * Regenerate a specific individual post content
   */
  async regenerateIndividualPost(userId: string, postId: string, individualPostId: string): Promise<PostResponse> {
    try {
      // Get existing post
      const existingPost = await this.getPostById(userId, postId);
      if (!existingPost) {
        throw new Error('Post not found');
      }

      // Find the specific individual post to regenerate
      const individualPosts = existingPost.individual_posts || [];
      const targetPostIndex = individualPosts.findIndex(post => post.id === individualPostId);
      
      if (targetPostIndex === -1) {
        throw new Error('Individual post not found');
      }

      const targetPost = individualPosts[targetPostIndex];
      console.log('Target individual post:', JSON.stringify(targetPost, null, 2));

      // Generate new content for just this one post using original parameters
      const generateRequest: PostGenerationRequest = {
        inputBullets: existingPost.input_bullets,
        platform: existingPost.platform,
        tone: existingPost.tone,
        additionalContext: existingPost.additionalContext || '', 
        days: 1,
        includeHashtags: existingPost.includeHashtags !== false,
        includeImages: existingPost.includeImages !== false,
      };

      console.log('Generation request:', JSON.stringify(generateRequest, null, 2));

      const generatedPosts = await contentGenerationService.generateRegeneratedPosts(generateRequest, targetPost.content);
      
      if (generatedPosts.length === 0) {
        throw new Error('Failed to generate new content');
      }

      const newPost = generatedPosts[0]; 
      console.log('Generated new post:', JSON.stringify(newPost, null, 2));

      // Create new individual post with the same ID but new content
      const updatedIndividualPost = {
        ...targetPost,
        content: newPost.content,
        hashtags: newPost.hashtags,
        images: newPost.imageSuggestions,
        image_metadata: newPost.images || []
      };

      // Update the specific individual post in the array
      const updatedIndividualPosts = [...individualPosts];
      updatedIndividualPosts[targetPostIndex] = updatedIndividualPost;

      // Update the main post's generated_posts array to maintain consistency
      const updatedGeneratedPosts = updatedIndividualPosts.map(post => post.content);

      // Update post with new individual post data
      const updates: UpdatePostRequest = {
        generated_posts: updatedGeneratedPosts,
        individual_posts: updatedIndividualPosts
      };

      console.log('Update request:', JSON.stringify(updates, null, 2));

      const result = await this.updatePost(userId, postId, updates);
      console.log('Update result:', JSON.stringify(result, null, 2));
      
      return result;
    } catch (error) {
      console.error('Error regenerating individual post:', error);
      throw new Error('Failed to regenerate individual post');
    }
  }

  /**
   * Regenerate content for an existing post (all posts)
   */
  async regenerateContent(userId: string, postId: string): Promise<PostResponse> {
    try {
      // Get existing post
      const existingPost = await this.getPostById(userId, postId);
      if (!existingPost) {
        throw new Error('Post not found');
      }

      console.log('Regenerating content for post:', existingPost.id);
      console.log('Existing post data:', JSON.stringify(existingPost, null, 2));

      // Generate new content with all the original parameters
      const generateRequest: PostGenerationRequest = {
        inputBullets: existingPost.input_bullets,
        platform: existingPost.platform,
        tone: existingPost.tone,
        additionalContext: existingPost.additionalContext || '', 
        days: existingPost.days || 1,
        includeHashtags: existingPost.includeHashtags !== false,
        includeImages: existingPost.includeImages !== false
      };

      console.log('Generation request:', JSON.stringify(generateRequest, null, 2));

      // Use the first generated post content as reference for regeneration
      const existingContent = existingPost.generated_posts[0] || '';
      const generatedPosts = await contentGenerationService.generateRegeneratedPosts(generateRequest, existingContent);
      
      console.log('Generated posts:', JSON.stringify(generatedPosts, null, 2));
      
      // Extract new content and hashtags
      const generatedContent = generatedPosts.map(post => post.content);
      const allHashtags = generatedPosts.flatMap(post => post.hashtags);
      const imageSuggestions = generatedPosts.flatMap(post => post.imageSuggestions);
      const allImages = generatedPosts.flatMap(post => post.images || []);

      console.log('Extracted content:', generatedContent);
      console.log('Extracted hashtags:', allHashtags);
      console.log('Extracted images:', allImages);

      // Create new individual posts with unique IDs
      const newIndividualPosts = generatedPosts.map((post, index) => ({
        id: `post_${Date.now()}_${index}`, // Generate unique ID for each individual post
        content: post.content,
        hashtags: post.hashtags,
        images: post.imageSuggestions,
        image_metadata: post.images || [],
        day_number: index + 1,
        posting_date: undefined
      }));

      // Update post with new content
      const updates: UpdatePostRequest = {
        generated_posts: generatedContent,
        hashtags: allHashtags,
        images: imageSuggestions,
        individual_posts: newIndividualPosts
      };

      console.log('Update request:', JSON.stringify(updates, null, 2));

      const result = await this.updatePost(userId, postId, updates);
      console.log('Update result:', JSON.stringify(result, null, 2));
      
      return result;
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
   * Update images for a specific post
   */
  async updatePostImages(userId: string, postId: string, contentIndex: number, images: string[], action: 'add' | 'remove' | 'replace'): Promise<PostResponse> {
    try {
      // Get existing post
      const existingPost = await this.getPostById(userId, postId);
      if (!existingPost) {
        throw new Error('Post not found');
      }

      // Get current individual posts
      const individualPosts = existingPost.individual_posts || [];
      
      if (contentIndex >= individualPosts.length) {
        throw new Error('Invalid content index');
      }

      // Update the specific individual post
      const updatedIndividualPosts = [...individualPosts];
      
      switch (action) {
        case 'add':
          // Add new images to existing ones
          updatedIndividualPosts[contentIndex] = {
            ...updatedIndividualPosts[contentIndex],
            images: [...(updatedIndividualPosts[contentIndex].images || []), ...images]
          };
          break;
          
        case 'replace':
          // Replace all images with new ones
          updatedIndividualPosts[contentIndex] = {
            ...updatedIndividualPosts[contentIndex],
            images: images
          };
          break;
          
        case 'remove':
          // Remove all images for this content
          updatedIndividualPosts[contentIndex] = {
            ...updatedIndividualPosts[contentIndex],
            images: []
          };
          break;
          
        default:
          throw new Error('Invalid action');
      }

      // Update the post in the database
      const { data, error } = await supabase
        .from('posts')
        .update({
          individual_posts: updatedIndividualPosts,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return this.mapToPostResponse(data as Post);
    } catch (error) {
      console.error('Error updating post images:', error);
      throw new Error('Failed to update post images');
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
   * Create individual scheduled post records
   */
  private async createScheduledPostRecords(userId: string, parentPostId: string, scheduledPosts: ScheduledPost[], parentRequest: CreatePostRequest): Promise<void> {
    try {
      const scheduledPostRecords = scheduledPosts.map(post => ({
        user_id: userId,
        parent_post_id: parentPostId,
        content: post.content,
        hashtags: post.hashtags,
        images: post.imageSuggestions,
        image_metadata: post.images || [],
        posting_date: post.postingDate,
        day_number: post.dayNumber,
        platform: parentRequest.platform,
        tone: parentRequest.tone,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('scheduled_posts')
        .insert(scheduledPostRecords);

      if (error) {
        console.error('Error creating scheduled post records:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error creating scheduled post records:', error);
      
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
      image_metadata: post.image_metadata,
      individual_posts: post.individual_posts,
      // Include original request parameters
      includeHashtags: post.include_hashtags,
      includeImages: post.include_images,
      days: post.days,
      additionalContext: post.additional_context,
      scheduled_at: post.scheduled_at,
      status: post.status,
      created_at: post.created_at,
      updated_at: post.updated_at
    };
  }
}

// Export singleton instance
export const postService = new PostService();
