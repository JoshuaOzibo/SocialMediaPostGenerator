import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/lib/api';
import { 
  CreatePostRequest, 
  UpdatePostRequest, 
  PostFilters, 
} from '@/lib/api/types';
import { queryKeys } from '@/lib/api/types';

// Hook for getting posts with filters
export const usePosts = (filters: PostFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.posts.list(filters),
    queryFn: () => postsApi.getPosts(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for infinite scrolling posts
// export const useInfinitePosts = (filters: PostFilters = {}) => {
//   return useInfiniteQuery({
//     queryKey: queryKeys.posts.list(filters),
//     queryFn: ({ pageParam = 1 }) => 
//       postsApi.getPosts({ ...filters, page: pageParam }),
//     getNextPageParam: (lastPage) => 
//       lastPage.hasMore ? lastPage.page + 1 : undefined,
//     staleTime: 2 * 60 * 1000, // 2 minutes
//   });
// };

// Hook for getting single post
export const usePost = (id: string) => {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => postsApi.getPost(id),
    enabled: !!id, // Only run if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for creating post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: CreatePostRequest) => postsApi.createPost(postData),
    onSuccess: (newPost) => {
      // Invalidate posts list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      
      // Add new post to cache
      queryClient.setQueryData(
        queryKeys.posts.detail(newPost.id),
        newPost
      );
    },
    onError: (error) => {
      console.error('Create post error:', error);
    },
  });
};

// Hook for updating post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostRequest }) =>
      postsApi.updatePost(id, data),
    onSuccess: (updatedPost) => {
      // Invalidate posts list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      
      // Update post in cache
      queryClient.setQueryData(
        queryKeys.posts.detail(updatedPost.id),
        updatedPost
      );
    },
    onError: (error) => {
      console.error('Update post error:', error);
    },
  });
};

// Hook for deleting post
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onSuccess: (_, deletedId) => {
      // Invalidate posts list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      
      // Remove post from cache
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(deletedId) });
    },
    onError: (error) => {
      console.error('Delete post error:', error);
    },
  });
};

// Hook for regenerating post content
export const useRegenerateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.regenerateContent(id),
    onSuccess: (updatedPost) => {
      // Invalidate posts list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      
      // Update post in cache
      queryClient.setQueryData(
        queryKeys.posts.detail(updatedPost.id),
        updatedPost
      );
    },
    onError: (error) => {
      console.error('Regenerate content error:', error);
    },
  });
};

// Hook for getting post statistics
export const usePostStats = () => {
  return useQuery({
    queryKey: queryKeys.posts.stats(),
    queryFn: postsApi.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for getting scheduled posts
export const useScheduledPosts = () => {
  return useQuery({
    queryKey: queryKeys.posts.scheduled(),
    queryFn: postsApi.getScheduledPosts,
    staleTime: 1 * 60 * 1000, // 1 minute (scheduled posts change frequently)
  });
};

// Hook for bulk delete posts
export const useBulkDeletePosts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => postsApi.bulkDelete(ids),
    onSuccess: (_, deletedIds) => {
      // Invalidate posts list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      
      // Remove deleted posts from cache
      deletedIds.forEach(id => {
        queryClient.removeQueries({ queryKey: queryKeys.posts.detail(id) });
      });
    },
    onError: (error) => {
      console.error('Bulk delete posts error:', error);
    },
  });
};

// Hook for bulk update posts
export const useBulkUpdatePosts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, updates }: { ids: string[]; updates: Partial<UpdatePostRequest> }) =>
      postsApi.bulkUpdate(ids, updates),
    onSuccess: (updatedPosts) => {
      // Invalidate posts list queries
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      
      // Update posts in cache
      updatedPosts.forEach(post => {
        queryClient.setQueryData(
          queryKeys.posts.detail(post.id),
          post
        );
      });
    },
    onError: (error) => {
      console.error('Bulk update posts error:', error);
    },
  });
};

// Hook for exporting posts
export const useExportPosts = () => {
  return useMutation({
    mutationFn: ({ filters, format }: { filters?: PostFilters; format?: 'csv' | 'json' }) =>
      postsApi.exportPosts(filters, format),
    onError: (error) => {
      console.error('Export posts error:', error);
    },
  });
};
