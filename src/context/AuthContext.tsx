import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  email: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  register: (email: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load user', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string) => {
    // Mock login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = { id: '1', email, username: email.split('@')[0] };
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const register = async (email: string, username: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = { id: '1', email, username };
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
