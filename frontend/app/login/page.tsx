'use client';

import React, { useState } from 'react';
import { useAuth } from '../api/auth/context';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      router.push('/');
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 ">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">
            {isRegistering ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input rounded-t-md"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input rounded-b-md"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button type="submit" className="btn btn-primary w-full">
              {isRegistering ? 'Register' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 hover:text-blue-800"
          >
            {isRegistering
              ? 'Already have an account? Sign in'
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
} 