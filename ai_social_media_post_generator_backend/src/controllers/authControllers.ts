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
  // console.log(signInData);
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

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { user, accessToken } = req.body;
    
    if (!user || !accessToken) {
      return res.status(400).json({ error: 'User data and access token are required' });
    }

    const { id, name, email, picture, emailVerified } = user;

    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) return res.status(500).json({ error: listError.message });
    
    const existingUser = existingUsers?.users?.find((u) => u.email === email);
    
    let authUser;
    let session;

    if (existingUser) {
      // User exists, sign them in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: accessToken, // This won't work for Google users, we need a different approach
      });
      
      if (signInError) {
        // If password sign-in fails, we need to handle Google OAuth properly
        // For now, we'll create a new user with a generated password
        const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
          email,
          password: `google_${id}_${Date.now()}`, // Generate a unique password
          email_confirm: true,
          user_metadata: {
            google_id: id,
            full_name: name,
            avatar_url: picture,
            email_verified: emailVerified,
            auth_provider: 'google'
          },
        });
        
        if (adminError) return res.status(400).json({ error: adminError.message });
        authUser = adminData.user;
        
        // Sign in the user
        const { data: signInData2, error: signInError2 } = await supabase.auth.signInWithPassword({
          email,
          password: `google_${id}_${Date.now()}`,
        });
        
        if (signInError2) return res.status(500).json({ error: 'Failed to sign in Google user' });
        session = signInData2.session;
      } else {
        authUser = signInData.user;
        session = signInData.session;
      }
    } else {
      // Create new user
      const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
        email,
        password: `google_${id}_${Date.now()}`, // Generate a unique password
        email_confirm: true,
        user_metadata: {
          google_id: id,
          full_name: name,
          avatar_url: picture,
          email_verified: emailVerified,
          auth_provider: 'google'
        },
      });
      
      if (adminError) return res.status(400).json({ error: adminError.message });
      authUser = adminData.user;
      
      // Sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: `google_${id}_${Date.now()}`,
      });
      
      if (signInError) return res.status(500).json({ error: 'Failed to sign in Google user' });
      session = signInData.session;
    }

    // Create or update user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: authUser.id,
        full_name: name,
        avatar_url: picture,
      }, {
        onConflict: 'user_id'
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't fail the request if profile creation fails
    }

    res.status(200).json({ 
      user: authUser, 
      session,
      message: existingUser ? 'Google user signed in successfully' : 'Google user created and signed in successfully'
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Internal server error during Google authentication' });
  }
};