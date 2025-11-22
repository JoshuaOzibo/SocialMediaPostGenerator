import supabase from '../lib/config/supabaseClient.js';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const signUp = async (req: Request, res: Response) => {
    console.log('Signup request received:', req.body);
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
        console.log('Missing required fields:', { username: !!username, email: !!email, password: !!password });
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
  // console.log(data);
};

export const googleAuth = async (req: Request, res: Response) => {
  console.log('🔵 [Google Auth] Request received');
  console.log('🔵 [Google Auth] Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { user, accessToken } = req.body;
    
    // Validate user data (accessToken is optional)
    if (!user) {
      console.error('❌ [Google Auth] Missing user data');
      return res.status(400).json({ error: 'User data is required' });
    }

    const { id, name, email, picture, emailVerified } = user;

    // Validate required user fields
    if (!id || !email) {
      console.error('❌ [Google Auth] Missing required user fields:', { id: !!id, email: !!email });
      return res.status(400).json({ error: 'User ID and email are required' });
    }

    console.log('🔵 [Google Auth] Processing user:', { id, email, name });

    // Check if user already exists by email
    console.log('🔵 [Google Auth] Checking for existing user...');
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ [Google Auth] Error listing users:', listError);
      return res.status(500).json({ error: listError.message });
    }
    
    console.log('🔵 [Google Auth] Total users found:', existingUsers?.users?.length || 0);
    
    const existingUser = existingUsers?.users?.find((u) => u.email === email);
    
    if (existingUser) {
      console.log('🔵 [Google Auth] Existing user found:', {
        id: existingUser.id,
        email: existingUser.email,
        metadata: existingUser.user_metadata
      });
    } else {
      console.log('🔵 [Google Auth] No existing user found, will create new user');
    }
    
    let authUser;
    let session;

    if (existingUser) {
      // User exists - link Google account to existing user (regardless of original auth method)
      console.log('🔵 [Google Auth] User exists, linking Google account...');
      console.log('🔵 [Google Auth] Existing user metadata:', existingUser.user_metadata);
      
      // Update user metadata to include Google auth info
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
      
      if (updateError) {
        console.error('❌ [Google Auth] Error updating user metadata:', updateError);
        // Continue anyway, don't fail the request
      } else {
        console.log('✅ [Google Auth] User metadata updated with Google info');
      }
      
      authUser = updateData?.user || existingUser;
      console.log('🔵 [Google Auth] Using existing user:', authUser.id);
      
      // Generate a Google password pattern and update user's password
      // This allows them to sign in with Google in the future
      const googlePassword = `google_${id}_${Date.now()}`;
      
      console.log('🔵 [Google Auth] Updating user password for Google sign-in...');
      const { error: updatePasswordError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          password: googlePassword
        }
      );
      
      if (updatePasswordError) {
        console.error('❌ [Google Auth] Error updating password:', updatePasswordError);
        // Fallback: generate JWT token
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (serviceKey) {
          try {
            // Create a JWT token that Supabase will accept
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
            
            console.log('✅ [Google Auth] JWT token generated as fallback');
          } catch (tokenError) {
            console.error('❌ [Google Auth] Error generating JWT:', tokenError);
            return res.status(500).json({ error: 'Failed to create session' });
          }
        } else {
          return res.status(500).json({ error: 'Service role key not configured' });
        }
      } else {
        // Sign in with the updated password to get a real session
        console.log('🔵 [Google Auth] Signing in with updated password...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: googlePassword
        });
        
        if (signInError || !signInData?.session) {
          console.error('❌ [Google Auth] Could not sign in after password update:', signInError);
          // Fallback: generate JWT token
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
              
              console.log('✅ [Google Auth] JWT token generated as fallback');
            } catch (tokenError) {
              console.error('❌ [Google Auth] Error generating JWT:', tokenError);
              return res.status(500).json({ error: 'Failed to create session' });
            }
          } else {
            return res.status(500).json({ error: 'Service role key not configured' });
          }
        } else {
          // Successfully signed in, use the real session
          session = signInData.session;
          console.log('✅ [Google Auth] Real session created via signInWithPassword');
        }
      }
      
      console.log('✅ [Google Auth] Session created for existing user');
      
    } else {
      // Create new Google user
      console.log('🔵 [Google Auth] Creating new Google user...');
      
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
        console.error('❌ [Google Auth] Error creating user:', adminError);
        return res.status(400).json({ error: adminError.message });
      }
      
      authUser = adminData.user;
      console.log('✅ [Google Auth] New Google user created:', authUser.id);
      
      // Sign in the newly created user to get a real session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: googlePassword
      });
      
      if (signInError || !signInData?.session) {
        console.warn('⚠️ [Google Auth] Could not sign in new user, creating fallback session');
        // Fallback session
        session = {
          access_token: `mock_${Date.now()}`,
          refresh_token: `mock_refresh_${Date.now()}`,
          expires_in: 3600,
          token_type: 'bearer',
          user: authUser
        };
      } else {
        session = signInData.session;
        console.log('✅ [Google Auth] Real session created for new user');
      }
    }

    // Create or update user profile
    console.log('🔵 [Google Auth] Creating/updating user profile...');
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
      console.error('❌ [Google Auth] Profile creation error:', profileError);
      // Don't fail the request if profile creation fails
    } else {
      console.log('✅ [Google Auth] User profile created/updated');
    }

    console.log('✅ [Google Auth] Success! Returning response');
    res.status(200).json({ 
      user: authUser, 
      session,
      message: existingUser ? 'Google user signed in successfully' : 'Google user created and signed in successfully'
    });

  } catch (error) {
    console.error('❌ [Google Auth] Unexpected error:', error);
    console.error('❌ [Google Auth] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ error: 'Internal server error during Google authentication' });
  }
};

// Get current user endpoint
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // The user should be available from the auth middleware
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get user details from Supabase
    const { data: userData, error } = await supabase.auth.admin.getUserById(user.id);
    
    if (error) {
      console.error('Error fetching user:', error);
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
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};