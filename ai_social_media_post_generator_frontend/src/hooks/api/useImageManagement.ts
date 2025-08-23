import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/lib/api/posts';
import { toast } from 'sonner';

export const useImageManagement = () => {
  const queryClient = useQueryClient();

  // Upload and replace images
  const replaceImages = useMutation({
    mutationFn: async ({
      postId,
      contentIndex,
      images
    }: {
      postId: string;
      contentIndex: number;
      images: string[];
    }) => {
      return postsApi.updateImages(postId, contentIndex, images, 'replace');
    },
    onSuccess: () => {
      toast.success('Images updated successfully!');
      // Invalidate posts query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: Error) => {
      console.error('Error updating images:', error);
      toast.error('Failed to update images', {
        description: error.message || 'Please try again.'
      });
    }
  });

  // Add images to existing ones
  const addImages = useMutation({
    mutationFn: async ({
      postId,
      contentIndex,
      images
    }: {
      postId: string;
      contentIndex: number;
      images: string[];
    }) => {
      return postsApi.updateImages(postId, contentIndex, images, 'add');
    },
    onSuccess: () => {
      toast.success('Images added successfully!');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: Error) => {
      console.error('Error adding images:', error);
      toast.error('Failed to add images', {
        description: error.message || 'Please try again.'
      });
    }
  });

  // Remove all images
  const removeImages = useMutation({
    mutationFn: async ({
      postId,
      contentIndex
    }: {
      postId: string;
      contentIndex: number;
    }) => {
      return postsApi.updateImages(postId, contentIndex, [], 'remove');
    },
    onSuccess: () => {
      toast.success('Images removed successfully!');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: Error) => {
      console.error('Error removing images:', error);
      toast.error('Failed to remove images', {
        description: error.message || 'Please try again.'
      });
    }
  });

  return {
    replaceImages,
    addImages,
    removeImages
  };
};
