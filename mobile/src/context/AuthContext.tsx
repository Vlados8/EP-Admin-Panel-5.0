import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { fetchCurrentUser, loginAPI } from '../api/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function initAuth() {
      const savedToken = await SecureStore.getItemAsync('token');
      if (savedToken) {
        setToken(savedToken);
      }
      setIsInitializing(false);
    }
    initAuth();
  }, []);

  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (userError) {
      logout();
    }
  }, [userError]);

  const loginMutation = useMutation({
    mutationFn: ({ email, pass }: { email: string; pass: string }) => loginAPI(email, pass),
    onSuccess: async (res) => {
      // Backend returns { status: 'success', token, data: { user } }
      const tokenString = res.token;
      const userObj = res.data?.user;

      if (tokenString) {
        await SecureStore.setItemAsync('token', tokenString);
        setToken(tokenString);
      }
      
      if (userObj) {
        await SecureStore.setItemAsync('user', JSON.stringify(userObj));
      }
    },
  });

  const login = async (email: string, pass: string) => {
    await loginMutation.mutateAsync({ email, pass });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    setToken(null);
    queryClient.clear();
  };

  const value = {
    user: userData?.data?.user || null,
    isLoading: isInitializing || userLoading || loginMutation.isPending,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
