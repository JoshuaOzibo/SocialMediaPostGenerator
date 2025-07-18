// Export all post controllers
export { createPostController } from './createPostController.js';
export { getPostController } from './getPostController.js';
export { updatePostController } from './updatePostController.js';
export { deletePostController } from './deletePostController.js';

// Export base controller for inheritance
export { BaseController, AuthenticatedRequest, ApiResponse } from '../baseController.js'; 