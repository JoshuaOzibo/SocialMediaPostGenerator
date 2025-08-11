# Google OAuth Integration

This project includes a clean, well-structured Google OAuth integration with proper separation of concerns and modern React patterns.

## Architecture Overview

### 1. Service Layer (`/lib/auth/googleAuthService.ts`)
- **Singleton Pattern**: Ensures single instance of Google Auth service
- **Token Processing**: Handles JWT token decoding and validation
- **User Data Extraction**: Extracts and formats user information from Google tokens
- **Console Logging**: Logs user details as requested (no backend communication)

### 2. Custom Hook (`/hooks/api/useGoogleAuth.ts`)
- **State Management**: Manages authentication state, loading, and errors
- **Local Storage**: Persists user data across sessions
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Clean API**: Provides simple interface for components

### 3. UI Components
- **GoogleSignInButton**: Reusable button component with Google OAuth integration
- **GoogleAuthDemo**: Demo component showcasing user data display
- **Provider Integration**: Google OAuth provider in app layout

### 4. Utilities (`/lib/utils.ts`)
- **JWT Decoding**: Robust JWT token decoding utility
- **Data Formatting**: Consistent user data formatting across the app
- **Type Safety**: TypeScript interfaces for all Google user data

## Features

✅ **Clean Architecture**: Proper separation of concerns  
✅ **Type Safety**: Full TypeScript support  
✅ **Error Handling**: Comprehensive error handling  
✅ **State Management**: React hooks for state management  
✅ **Persistence**: Local storage for user data  
✅ **Console Logging**: User details logged to console  
✅ **No Backend**: Pure frontend implementation  
✅ **Reusable**: Modular components and hooks  
✅ **Modern UI**: Beautiful, responsive design  

## Quick Start

### 1. Install Dependencies
```bash
npm install @react-oauth/google
```

### 2. Set Up Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Use in Components
```tsx
import { useGoogleAuth } from '@/hooks/api/useGoogleAuth';
import GoogleSignInButton from '@/components/googleButton';

const MyComponent = () => {
  const { user, isAuthenticated, signOut } = useGoogleAuth();

  return (
    <div>
      {!isAuthenticated ? (
        <GoogleSignInButton 
          onSuccess={() => console.log('Success!')}
          onError={(error) => console.error(error)}
        />
      ) : (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
};
```

## API Reference

### GoogleAuthService
```typescript
class GoogleAuthService {
  static getInstance(): GoogleAuthService
  getGoogleClientId(): string
  handleGoogleSignIn(credential: string): Promise<GoogleAuthResponse>
  validateGoogleToken(token: string): boolean
}
```

### useGoogleAuth Hook
```typescript
interface UseGoogleAuthReturn {
  signInWithGoogle: (credential: string) => Promise<void>
  isLoading: boolean
  error: string | null
  user: GoogleUser | null
  isAuthenticated: boolean
  signOut: () => void
}
```

### GoogleSignInButton Props
```typescript
interface GoogleSignInButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}
```

## User Data Structure

```typescript
interface GoogleUser {
  sub: string           // User ID
  name: string          // Full name
  given_name: string    // First name
  family_name: string   // Last name
  picture: string       // Profile picture URL
  email: string         // Email address
  email_verified: boolean // Email verification status
  locale: string        // User locale
}
```

## Console Output

When a user signs in, the following data is logged to the console:

```javascript
{
  user: {
    id: "123456789",
    name: "John Doe",
    email: "john.doe@example.com",
    picture: "https://lh3.googleusercontent.com/...",
    emailVerified: true
  },
  accessToken: "eyJhbGciOiJSUzI1NiIs...",
  expiresAt: "2024-01-01T12:00:00.000Z"
}
```

## Error Handling

The integration includes comprehensive error handling:

- **Invalid Tokens**: Graceful handling of malformed JWT tokens
- **Network Errors**: User-friendly error messages for network issues
- **User Cancellation**: Proper handling when users cancel the OAuth flow
- **Expired Tokens**: Automatic token validation and cleanup

## Security Considerations

- **Token Security**: Only partial tokens are logged for security
- **Environment Variables**: Client ID stored in environment variables
- **No Sensitive Data**: No sensitive data stored in localStorage
- **Token Validation**: Automatic token expiration checking

## Testing

To test the integration:

1. Set up Google OAuth credentials (see `GOOGLE_OAUTH_SETUP.md`)
2. Start the development server: `npm run dev`
3. Navigate to the login page
4. Click "Continue with Google"
5. Complete the OAuth flow
6. Check browser console for user details

## Troubleshooting

### Common Issues

1. **Button Not Appearing**
   - Check that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
   - Verify Google OAuth provider is wrapped around your app

2. **"popup_closed_by_user" Error**
   - Check popup blocker settings
   - Ensure authorized domains are configured correctly

3. **"access_denied" Error**
   - Add your email to test users in Google Cloud Console
   - Check OAuth consent screen configuration

4. **Token Decoding Errors**
   - Verify the token format is correct
   - Check that the JWT utility functions are working

### Debug Mode

Enable debug logging by adding to your component:

```typescript
const { signInWithGoogle, error } = useGoogleAuth();

// Log errors for debugging
useEffect(() => {
  if (error) {
    console.error('Google Auth Error:', error);
  }
}, [error]);
```

## Future Enhancements

- [ ] Backend integration for token validation
- [ ] Refresh token handling
- [ ] Multi-provider authentication (Facebook, GitHub, etc.)
- [ ] Advanced user profile management
- [ ] Offline support with service workers
