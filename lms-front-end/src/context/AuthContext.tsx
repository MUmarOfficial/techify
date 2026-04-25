import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import type { User, AuthState, LoginPayload, RegisterPayload } from '../types';
import { loginUser, registerUser } from '../services/authService';
import api from '../services/api';
import { AuthContext } from './authContextValue';

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

export default function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('lms_token');
    const user = localStorage.getItem('lms_user');
    if (token && user) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch({ type: 'SET_USER', payload: { token, user: JSON.parse(user) as User } });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await loginUser(payload);
    localStorage.setItem('lms_token', res.token);
    localStorage.setItem('lms_user', JSON.stringify(res.user));
    api.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
    dispatch({ type: 'SET_USER', payload: res });
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await registerUser(payload);
    localStorage.setItem('lms_token', res.token);
    localStorage.setItem('lms_user', JSON.stringify(res.user));
    api.defaults.headers.common['Authorization'] = `Bearer ${res.token}`;
    dispatch({ type: 'SET_USER', payload: res });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
    delete api.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateUser = useCallback((user: User) => {
    localStorage.setItem('lms_user', JSON.stringify(user));
    dispatch({ type: 'UPDATE_USER', payload: user });
  }, []);

  const value = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    updateUser,
  }), [state, login, register, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
