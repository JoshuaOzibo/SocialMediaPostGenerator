import { Router } from 'express';
import { signUp, signIn, googleAuth } from '../controllers/authControllers.ts';
import { blockIfAuthenticated } from '../middlewares/authMiddleware.ts';

const route = Router();

// Signup Route
route.post('/signup', blockIfAuthenticated, signUp);

// Signin Route
route.post('/signin', signIn);

// Google OAuth Route
route.post('/google', blockIfAuthenticated, googleAuth);

export default route;
