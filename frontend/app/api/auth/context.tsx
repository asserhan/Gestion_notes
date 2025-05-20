'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.detail === "User not found") {
          toast.error("No account found with this email. Please register first.");
        } else if (data.detail === "Incorrect password") {
          toast.error("Wrong password. Please try again.");
        } else {
          toast.error(data.detail || 'Login failed');
        }
        throw new Error(data.detail || 'Login failed');
      }

      // Get user data after successful login
      const userResponse = await fetch('http://127.0.0.1:8000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error(data.detail || 'Failed to get user data');
      }

      const userData = await userResponse.json();
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        email: userData.email,
      }));

      setUser({
        id: userData.id,
        email: userData.email,
      });

      toast.success(`Welcome back ${userData.email}!`);
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      // Error message is already shown by toast above
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      // Get user data after successful registration
      const userResponse = await fetch('http://127.0.0.1:8000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error(data.detail || 'Failed to get user data');
      }

      const userData = await userResponse.json();
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        email: userData.email,
      }));

      setUser({
        id: userData.id,
        email: userData.email,
      });

      toast.success(`Welcome ${userData.email}! Your account has been created successfully.`);
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
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