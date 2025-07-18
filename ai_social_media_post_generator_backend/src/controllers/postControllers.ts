// This file is now a compatibility layer that delegates to the new modular controllers
// For new code, use the individual controllers directly

import { Response } from 'express';
import { 
  createPostController, 
  getPostController, 
  updatePostController, 
  deletePostController
} from './postControllers/index.js';
import type { AuthenticatedRequest } from './baseController.js';

// Re-export types for backward compatibility
export type { AuthenticatedRequest } from './baseController.js';

/**
 * @deprecated Use createPostController.execute() directly instead
 */
export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await createPostController.execute(req, res);
};

/**
 * @deprecated Use getPostController.getById() directly instead
 */
export const getPostById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await getPostController.getById(req, res);
};

/**
 * @deprecated Use getPostController.getList() directly instead
 */
export const getPosts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await getPostController.getList(req, res);
};

/**
 * @deprecated Use getPostController.getStats() directly instead
 */
export const getPostStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await getPostController.getStats(req, res);
};

/**
 * @deprecated Use updatePostController.execute() directly instead
 */
export const updatePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await updatePostController.execute(req, res);
};

/**
 * @deprecated Use updatePostController.regenerateContent() directly instead
 */
export const regenerateContent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await updatePostController.regenerateContent(req, res);
};

/**
 * @deprecated Use deletePostController.execute() directly instead
 */
export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await deletePostController.execute(req, res);
};

// Also export the new controllers for direct use
export { 
  createPostController, 
  getPostController, 
  updatePostController, 
  deletePostController 
} from './postControllers/index.js';
