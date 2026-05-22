import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

type User = {
  id: string;
  email: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, username: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  /** true while a registration request is in flight */
  isRegistering: boolean;
  /** seconds left before another register attempt is allowed */
  cooldown: number;
  /** true when the registration‑success modal should be shown */
  registrationModalVisible: boolean;
  /** function to hide the modal */
  hideRegistrationModal: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Log changes to isLoading for debugging
  useEffect(() => {
    console.log('🔄 isLoading changed →', isLoading);
  }, [isLoading]);
  // Log user changes
  useEffect(() => {
    console.log('👤 user state →', user);
  }, [user]);

  // NEW: registration flow states
  const [isRegistering, setIsRegistering] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [registrationModalVisible, setRegistrationModalVisible] = useState(false);

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessError } = await supabase.auth.getSession();
        if (sessError) {
          console.error('Session fetch error:', sessError);
        }
        if (session && session.user) {
          // Fetch additional profile data – use maybeSingle to avoid error when no row exists
          const { data: profile, error: profError } = await supabase
            .from('users')
            .select('username')
            .eq('id', session.user.id)
            .maybeSingle();
          if (profError) {
            console.error('Profile fetch error (checkSession):', profError);
          }
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            username:
              profile?.username ||
              session.user.email?.split('@')[0] ||
              'User',
          });
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Failed to load user session (checkSession):', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth State Change Event:', event);
      if (session) {
        console.log('👤 User in session:', session.user.id);
      } else {
        console.log('👤 No user in session');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Cooldown countdown timer (used for registration rate‑limit)
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  // Defensive guard: if for any reason isLoading stays true for >5s, log a warning
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.warn('⚠️ isLoading still true after 5 seconds – possible stuck auth flow');
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  const login = async (email: string, password?: string) => {
    const pass = password || 'Default123!';
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
  };

  const register = async (email: string, username: string, password?: string) => {
    const pass = password || 'Default123!';
    setIsRegistering(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            username,
          },
        },
      });
      if (error) {
        // Rate‑limit handling – Supabase includes the wait time in the message
        const match = error.message?.match(/after (\d+) seconds/);
        if (match) {
          setCooldown(parseInt(match[1], 10));
        }
        throw error;
      }
      // Success – show confirmation modal
      setRegistrationModalVisible(true);
    } finally {
      setIsRegistering(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      // 1. If username is updated, update the public.users table
      if (updates.username) {
        const { error } = await supabase
          .from('users')
          .update({ username: updates.username })
          .eq('id', user.id);
        if (error) throw error;
      }

      // 2. If email is updated, update via Supabase Auth
      if (updates.email) {
        const { error } = await supabase.auth.updateUser({ email: updates.email });
        if (error) throw error;
      }

      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        isRegistering,
        cooldown,
        registrationModalVisible,
        hideRegistrationModal: () => setRegistrationModalVisible(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
