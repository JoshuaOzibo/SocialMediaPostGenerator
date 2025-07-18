import { Router } from 'express';
import { 
  createPost, 
  getPostById, 
  getPosts, 
  updatePost, 
  regenerateContent, 
  deletePost, 
  getPostStats 
} from '../controllers/postControllers.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { validatePostRequest, validateUpdateRequest, validateQueryParams } from '../middlewares/validationMiddleware.js';

const route = Router();

// Apply authentication middleware to all post routes
route.use(protectRoute);

// 📝 Post Management Routes
route.post('/', validatePostRequest, createPost);                    // Create new post
route.get('/', validateQueryParams, getPosts);                      // Get all posts with filters
route.get('/stats', getPostStats);                                  // Get post statistics
route.get('/:postId', getPostById);                                 // Get single post
route.put('/:postId', validateUpdateRequest, updatePost);           // Update post
route.post('/:postId/regenerate', regenerateContent);               // Regenerate content
route.delete('/:postId', deletePost);                               // Delete post

export default route; 