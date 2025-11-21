'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  // now also returns role so we can redirect based on it
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; role?: User['role'] }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // if parsing fails, clear bad data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user && data.token) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // 🔥 return role so the login page can redirect properly
        return { success: true, role: data.user.role as User['role'] };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
  } catch (e) {
    // ignore errors, still clear client state
  }

  setUser(null);
  setToken(null);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};


  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
