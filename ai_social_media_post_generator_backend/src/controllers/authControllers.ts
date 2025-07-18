import supabase from '../lib/config/supabaseClient.js';
import { Request, Response } from 'express';

export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Get all users (pagination can be added for large user bases)
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return res.status(500).json({ error: listError.message });
  const existingUser = usersData && usersData.users && usersData.users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User with this email already exists.' });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ user: data.user });
  // console.log(data);
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ session: data.session, user: data.user });
  // console.log(data);
};