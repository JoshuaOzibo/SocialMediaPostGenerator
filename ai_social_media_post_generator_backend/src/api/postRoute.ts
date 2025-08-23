import { Router } from 'express';
import { 
  createPostController, 
  getPostController, 
  updatePostController, 
  deletePostController 
} from '../controllers/postControllers/index.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { validatePostRequest, validateUpdateRequest, validateQueryParams } from '../middlewares/validationMiddleware.js';

const route = Router();

// Apply authentication middleware to all post routes
route.use(protectRoute);

// 📝 Post Management Routes
route.post('/', validatePostRequest, (req, res) => createPostController.execute(req, res));                    // Create new post

route.get('/', validateQueryParams, (req, res) => getPostController.getList(req, res));                      // Get all posts with filters
route.get('/stats', (req, res) => getPostController.getStats(req, res));                                  // Get post statistics
route.get('/scheduled', (req, res) => getPostController.getScheduledPosts(req, res));                     // Get scheduled posts
route.get('/:postId', (req, res) => getPostController.getById(req, res));                                 // Get single post
route.put('/:postId', validateUpdateRequest, (req, res) => updatePostController.execute(req, res));           // Update post
route.post('/:postId/regenerate', (req, res) => updatePostController.regenerateContent(req, res));               // Regenerate content
route.put('/:postId/images', (req, res) => updatePostController.updateImages(req, res));                        // Update post images
route.delete('/:postId', (req, res) => deletePostController.execute(req, res));                               // Delete post

export default route; 