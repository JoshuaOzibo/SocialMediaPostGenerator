import { Router } from 'express';
import { signUp, signIn, googleAuth, getCurrentUser } from '../controllers/authControllers.js';
import { blockIfAuthenticated, protectRoute } from '../middlewares/authMiddleware.js';

const route = Router();

// Signup Route
route.post('/signup', blockIfAuthenticated, signUp);

// Signin Route
route.post('/signin', signIn);

// Google OAuth Route
route.post('/google', blockIfAuthenticated, googleAuth);

// Get current user (protected route)
route.get('/me', protectRoute, getCurrentUser);

export default route;
