import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithRedirect, signOut as firebaseSignOut, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { getUserProfile, createUserProfile } from '@/lib/firestore';
import type { UserProfile } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    console.log('[AuthContext] Initializing...');
    
    // First, handle redirect result (if coming back from Google OAuth)
    getRedirectResult(auth)
      .then((result) => {
        console.log('[AuthContext] getRedirectResult completed:', result ? 'User found' : 'No result');
        if (result?.user) {
          // User just signed in via redirect
          console.log('[AuthContext] Redirect result received, loading profile for:', result.user.uid);
          setUser(result.user);
          return loadUserProfile(result.user);
        }
      })
      .catch((error) => {
        console.error('[AuthContext] Redirect error:', error);
      })
      .finally(() => {
        console.log('[AuthContext] Setting up onAuthStateChanged listener');
        // After handling redirect, listen to auth state changes
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          console.log('[AuthContext] onAuthStateChanged triggered, user:', user ? user.uid : 'null');
          setUser(user);
          if (user) {
            await loadUserProfile(user);
          } else {
            console.log('[AuthContext] No user, setting loading to false');
            setProfile(null);
            setLoading(false);
          }
        });
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const loadUserProfile = async (user: User) => {
    console.log('[AuthContext] loadUserProfile called for:', user.uid);
    try {
      const userProfile = await getUserProfile(user.uid);
      console.log('[AuthContext] Profile loaded:', userProfile ? 'Found' : 'Not found');
      setProfile(userProfile);
    } catch (error) {
      console.error('[AuthContext] Error loading profile:', error);
      setProfile(null);
    } finally {
      console.log('[AuthContext] Setting loading to false');
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
