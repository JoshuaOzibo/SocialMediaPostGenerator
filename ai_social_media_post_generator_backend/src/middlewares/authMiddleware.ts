import { Request, Response, NextFunction } from 'express';
import supabase from '../lib/config/supabaseClient.js';

export async function protectRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Attach user to request object
    (req as any).user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error validating token' });
  }
}

export async function blockIfAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return next(); // No token, allow to proceed

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (user && !error) {
      // User is authenticated
      return res.status(400).json({ error: 'User already signed in.' });
    }
    next();
  } catch (err) {
    next(); // On error, allow to proceed (treat as not authenticated)
  }
}
