# Google OAuth Setup Guide

## Prerequisites
1. A Google Cloud Console account
2. A Google Cloud Project

## Setup Steps

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

### 2. Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name
   - User support email
   - Developer contact information
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (your email addresses)

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
6. Copy the Client ID

### 4. Configure Environment Variables
Create a `.env.local` file in the frontend directory:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 5. Test the Integration
1. Start the development server: `npm run dev`
2. Navigate to the login page
3. Click "Continue with Google"
4. Complete the OAuth flow
5. Check the browser console for user details

## Security Notes
- Never commit your `.env.local` file to version control
- Use different Client IDs for development and production
- Regularly rotate your OAuth credentials
- Monitor OAuth usage in Google Cloud Console

## Troubleshooting
- If you get "popup_closed_by_user" error, check your popup blocker settings
- If you get "access_denied" error, make sure your email is added to test users
- If the button doesn't appear, check that the Client ID is correctly set in environment variables
