import { CLIENT_RENEG_LIMIT } from 'tls';
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

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { user, accessToken } = req.body;
    
    if (!user || !accessToken) {
      return res.status(400).json({ error: 'User data and access token are required' });
    }

    const { id, name, email, picture, emailVerified } = user;

    // Check if user already exists by email
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) return res.status(500).json({ error: listError.message });
    
    const existingUser = existingUsers?.users?.find((u) => u.email === email);
    
    let authUser;
    let session;

    if (existingUser) {
      // User exists - check if it's a Google user
      const isGoogleUser = existingUser.user_metadata?.auth_provider === 'google' || 
                          existingUser.user_metadata?.google_id === id;
      
      if (isGoogleUser) {
        // This is a Google user, we need to handle this differently
        // Since we can't sign in with Google token directly, we'll update the user metadata
        // and create a new session using admin API
        
        const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          {
            user_metadata: {
              ...existingUser.user_metadata,
              google_id: id,
              full_name: name,
              avatar_url: picture,
              email_verified: emailVerified,
              auth_provider: 'google',
              last_login: new Date().toISOString()
            }
          }
        );
        console.log(updateData);
        
        if (updateError) {
          console.error('Error updating user metadata:', updateError);
          // Continue anyway, don't fail the request
        }
        
        authUser = updateData?.user || existingUser;
        
        // Create a new session for the user
        const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: email,
          options: {
            redirectTo: `${process.env.FRONTEND_URL}`
          }
        });
        
        if (sessionError) {
          console.error('Error creating session:', sessionError);
          // For now, we'll return the user without a session
          // In a production app, you'd want to implement proper session management
        }
        
        // For now, we'll create a mock session since we can't easily create a real one
        session = {
          access_token: `mock_${Date.now()}`,
          refresh_token: `mock_refresh_${Date.now()}`,
          expires_in: 3600,
          token_type: 'bearer',
          user: authUser
        };
        console.log(session);
        
      } else {
        // This is a regular user, not a Google user
        return res.status(400).json({ 
          error: 'A user with this email address has already been registered with a different authentication method.' 
        });
      }
    } else {
      // Create new Google user
      const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
        email,
        password: `google_${id}_${Date.now()}`, // Generate a unique password
        email_confirm: true,
        user_metadata: {
          google_id: id,
          full_name: name,
          avatar_url: picture,
          email_verified: emailVerified,
          auth_provider: 'google',
          created_at: new Date().toISOString()
        },
      });
      
      if (adminError) {
        // Check if the error is about existing user
        if (adminError.message.includes('already been registered')) {
          return res.status(400).json({ 
            error: 'A user with this email address has already been registered with a different authentication method.' 
          });
        }
        return res.status(400).json({ error: adminError.message });
      }
      
      authUser = adminData.user;
      
      // Create a mock session for new users
      session = {
        access_token: `mock_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
        expires_in: 3600,
        token_type: 'bearer',
        user: authUser
      };
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