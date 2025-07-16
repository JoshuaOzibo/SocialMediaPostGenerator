import { Router } from 'express';
import { signUp, signIn } from '../controllers/authControllers.js';
import { blockIfAuthenticated } from '../middlewares/authMiddleware.js';

const route = Router();

// 📝 Signup Route
route.post('/signup', blockIfAuthenticated, signUp);

// 📝 Signin Route
route.post('/signin', signIn);

export default route;
