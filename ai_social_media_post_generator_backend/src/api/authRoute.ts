import { Router } from 'express';
import  supabase  from '../lib/config/supabaseClient';  // adjust path as needed

const route = Router();

// 📝 Signup Route
route.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ user: data.user });
});


// 📝 Signin Route (Client-side usually handles this)
route.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ session: data.session, user: data.user });
});

export default route;
