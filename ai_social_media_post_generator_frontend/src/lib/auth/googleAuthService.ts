import { GoogleUser, GoogleAuthResponse } from '@/lib/api/types';
import { decodeJwtToken, formatUserData } from '@/lib/utils';

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private googleClientId: string;
  private apiUrl: string;

  private constructor() {
    // You'll need to replace this with your actual Google Client ID
    this.googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  public getGoogleClientId(): string {
    return this.googleClientId;
  }

  public async handleGoogleSignIn(credential: string): Promise<GoogleAuthResponse> {
    try {
      // Decode the JWT token to get user information
      const payload = decodeJwtToken(credential);
      const user: GoogleUser = {
        sub: payload.sub,
        name: payload.name,
        given_name: payload.given_name,
        family_name: payload.family_name,
        picture: payload.picture,
        email: payload.email,
        email_verified: payload.email_verified,
        locale: payload.locale,
      };
      
      const response: GoogleAuthResponse = {
        user,
        access_token: credential,
        expires_at: Date.now() + 3600000, // 1 hour from now
      };

      // Log user details as requested
      console.log('Google Sign-In Successful:', {
        user: formatUserData(user),
        accessToken: credential.substring(0, 20) + '...', // Log partial token for security
        expiresAt: new Date(response.expires_at).toISOString(),
      });

      // Send user data to backend
      await this.sendToBackend(user, credential);

      return response;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw new Error('Failed to process Google sign-in');
    }
  }

  private async sendToBackend(user: GoogleUser, accessToken: string): Promise<void> {
    try {
      const formattedUser = formatUserData(user);
      
      const response = await fetch(`${this.apiUrl}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: formattedUser,
          accessToken: accessToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to authenticate with backend');
      }

      const data = await response.json();
      console.log('Backend authentication successful:', {
        message: data.message,
        userId: data.user?.id,
        session: data.session ? 'Session created' : 'No session'
      });

      // Store backend session data
      if (data.session) {
        localStorage.setItem('backendSession', JSON.stringify(data.session));
        localStorage.setItem('backendUser', JSON.stringify(data.user));
      }

    } catch (error) {
      console.error('Backend authentication error:', error);
      // Don't throw error here to avoid breaking the frontend flow
      // The user can still use the app with Google authentication
    }
  }

  public validateGoogleToken(token: string): boolean {
    try {
      const payload = decodeJwtToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
}

export default GoogleAuthService;
