# Firebase Setup Instructions

## Current Status
The application code is complete and functional. However, Firebase authentication requires additional configuration in the Firebase Console.

## Error You're Seeing
```
Firebase: Error (auth/configuration-not-found)
```

## Solution: Configure OAuth Redirect URIs

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `${VITE_FIREBASE_PROJECT_ID}`
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Add your Replit domain:
   ```
   *.replit.dev
   ```

5. Navigate to **Authentication** → **Sign-in method** → **Google**
6. Ensure Google sign-in is **enabled**
7. Under **Authorized domains**, add:
   - Your specific Replit app URL
   - `*.replit.dev` (wildcard for all Replit domains)

## Environment Variables Already Set
These secrets are already configured:
- ✅ `VITE_FIREBASE_API_KEY`
- ✅ `VITE_FIREBASE_PROJECT_ID`
- ✅ `VITE_FIREBASE_APP_ID`
- ✅ `SESSION_SECRET`

## Testing Locally
Once Firebase is configured:
1. Refresh the application
2. Click "Iniciar sesión con Google"
3. Complete the Google OAuth flow
4. You'll be redirected to the setup wizard (first time) or the calendar (returning user)

## Alternative: Test Without Auth
To test the UI without Firebase auth, you can temporarily bypass authentication by modifying `AuthContext.tsx`, but this is not recommended for production.
