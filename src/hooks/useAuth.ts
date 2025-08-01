import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider, 
  signInWithPopup,
} from 'firebase/auth';

interface User {
  id: string;
  email: string;
  name?: string; // Not stored by Firebase Auth unless set manually
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Watch Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          name: firebaseUser.displayName ?? undefined,
        });
      } else {
        setUser(null);
        
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCred.user;

      // Optionally update display name
      if (name && firebaseUser) {
        await updateProfile(firebaseUser, { displayName: name });
      }

      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        name: name,
      });

      return firebaseUser;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCred.user;

      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        name: firebaseUser.displayName ?? undefined,
      });

      return firebaseUser;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      window.location.reload(); // Clears users saved recipes on log out
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      return user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut: signOutUser,
    signInWithGoogle,
    isAuthenticated: !!user,
  };
};