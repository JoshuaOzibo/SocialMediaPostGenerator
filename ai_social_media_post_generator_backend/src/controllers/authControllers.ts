import supabase from '../lib/config/supabaseClient.js';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const signUp = async (req: Request, res: Response) => {
    // console.log('Signup request received:', req.body);
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
        // console.log('Missing required fields:', { username: !!username, email: !!email, password: !!password });
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

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
  // console.log("signIn request received:", req.body);
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    // console.log("signIn error:", error.message);
    
    if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid password')) {
      try {
        const { data: usersData } = await supabase.auth.admin.listUsers();
        const existingUser = usersData?.users?.find((u) => u.email === email);
        
        if (existingUser?.user_metadata?.google_id || existingUser?.user_metadata?.auth_provider === 'google' || existingUser?.user_metadata?.auth_provider === 'email_google') {
          return res.status(400).json({ 
            error: 'Invalid password. This account is linked to Google. Please use Google Sign-In or reset your password.' 
          });
        }
      } catch (checkError) {
        // console.error("Error checking user metadata:", checkError);
      }
    }
    
    return res.status(400).json({ error: error.message });
  }
  
  if (!data || !data.session || !data.user) {
    // console.error("signIn: Missing session or user data");
    return res.status(500).json({ error: 'Failed to create session' });
  }
  
  // console.log("signIn successful for user:", data.user.email);
  res.status(200).json({ session: data.session, user: data.user });
};

export const googleAuth = async (req: Request, res: Response) => {
  //  console.log("googleAuth request received:", req.body);
  try {
    const { user, accessToken } = req.body;
    
    if (!user) {
      return res.status(400).json({ error: 'User data is required' });
    }

    const { id, name, email, picture, emailVerified } = user;

    if (!id || !email) {
      return res.status(400).json({ error: 'User ID and email are required' });
    }

    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      return res.status(500).json({ error: listError.message });
    }
    
    
    const existingUser = existingUsers?.users?.find((u) => u.email === email);
    
    if (existingUser) {
    } else {
    }
    
    let authUser;
    let session;

    if (existingUser) {
      const isOriginalGoogleUser = existingUser.user_metadata?.auth_provider === 'google' || 
                                    existingUser.user_metadata?.google_id;
      
      const updatedMetadata: Record<string, any> = {
        ...existingUser.user_metadata,
        google_id: id,
        full_name: name,
        avatar_url: picture,
        email_verified: emailVerified,
        last_login: new Date().toISOString()
      };
      
      if (isOriginalGoogleUser) {
        updatedMetadata.auth_provider = 'google';
      } else {
        updatedMetadata.auth_provider = 'email_google';
      }
      
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          user_metadata: updatedMetadata
        }
      );
      
      authUser = updateData?.user || existingUser;
      
      let sessionCreated = false;
      
      if (isOriginalGoogleUser) {
        const googlePassword = `google_${id}_${Date.now()}`;
        
        const { error: updatePasswordError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          {
            password: googlePassword
          }
        );
        
        if (!updatePasswordError) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password: googlePassword
          });
          
          if (!signInError && signInData?.session) {
            session = signInData.session;
            sessionCreated = true;
          }
        }
      }
      
      if (!sessionCreated) {
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (serviceKey) {
          try {
            const token = jwt.sign(
              {
                aud: 'authenticated',
                exp: Math.floor(Date.now() / 1000) + 3600,
                sub: authUser.id,
                email: authUser.email,
                role: 'authenticated'
              },
              serviceKey,
              { algorithm: 'HS256' }
            );
            
            session = {
              access_token: token,
              refresh_token: `refresh_${Date.now()}`,
              expires_in: 3600,
              token_type: 'bearer',
              user: authUser
            };
            
            sessionCreated = true;
          } catch (tokenError) {
            return res.status(500).json({ error: 'Failed to create session' });
          }
        } else {
          return res.status(500).json({ error: 'Service role key not configured' });
        }
      }
      
    } else {
      
      const googlePassword = `google_${id}_${Date.now()}`;
      
      const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
        email,
        password: googlePassword,
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
        return res.status(400).json({ error: adminError.message });
      }
      
      authUser = adminData.user;
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: googlePassword
      });
      
      if (signInError || !signInData?.session) {
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (serviceKey) {
          try {
            const token = jwt.sign(
              {
                aud: 'authenticated',
                exp: Math.floor(Date.now() / 1000) + 3600,
                sub: authUser.id,
                email: authUser.email,
                role: 'authenticated'
              },
              serviceKey,
              { algorithm: 'HS256' }
            );
            
            session = {
              access_token: token,
              refresh_token: `refresh_${Date.now()}`,
              expires_in: 3600,
              token_type: 'bearer',
              user: authUser
            };
          } catch (tokenError) {
            return res.status(500).json({ error: 'Failed to create session' });
          }
        } else {
          return res.status(500).json({ error: 'Service role key not configured' });
        }
      } else {
        session = signInData.session;
      }
    }

    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: authUser.id,
        full_name: name,
        avatar_url: picture,
      }, {
        onConflict: 'user_id'
      });

      // console.log('profileError', profileError);

    res.status(200).json({ 
      user: authUser, 
      session,
      message: existingUser ? 'Google user signed in successfully' : 'Google user created and signed in successfully'
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error during Google authentication' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { data: userData, error } = await supabase.auth.admin.getUserById(user.id);
    
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch user data' });
    }

    if (!userData.user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        user: userData.user
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};