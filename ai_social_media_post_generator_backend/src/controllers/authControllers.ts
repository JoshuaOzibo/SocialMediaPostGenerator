import supabase from '../lib/config/supabaseClient.js';
import { Request, Response } from 'express';

export const signUp = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

  // Get all users (pagination can be added for large user bases)
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return res.status(500).json({ error: listError.message });
  const existingUser = usersData && usersData.users && usersData.users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  // Use admin API to create user directly (bypasses email confirmation)
  const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      username,
    },
  });
  
  if (adminError) return res.status(400).json({ error: adminError.message });

  // Sign in the user to get the session
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (signInError) {
    return res.status(500).json({ error: 'Failed to sign in user after signup' });
  }

  // Return the session and user data
  res.status(201).json({ 
    user: signInData.user, 
    session: signInData.session,
    message: 'User created and signed in successfully'
  });
  console.log(signInData);
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ session: data.session, user: data.user });
  console.log(data);
};