import { Router } from 'express';
import { signUp, signIn } from '../controllers/authControllers.js';

const route = Router();

// 📝 Signup Route
route.post('/signup', signUp);

// 📝 Signin Route
route.post('/signin', signIn);

export default route;
