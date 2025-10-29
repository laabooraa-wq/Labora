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
    
    // First, handle redirect result (if coming back from Google OAuth)
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          // User just signed in via redirect
          console.log('Redirect result received, loading profile...');
          setUser(result.user);
          return loadUserProfile(result.user);
        }
      })
      .catch((error) => {
        console.error('Redirect error:', error);
      })
      .finally(() => {
        // After handling redirect, listen to auth state changes
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          setUser(user);
          if (user) {
            await loadUserProfile(user);
          } else {
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
    try {
      const userProfile = await getUserProfile(user.uid);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
    } finally {
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
