import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('devshelf_token');
    const storedUser = localStorage.getItem('devshelf_user');

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const register = async (userName, email, password) => {
    const response = await api.post('/auth/register', {
      userName,
      email,
      password,
    });

    return response.data;
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const { token, id, userName, email: userEmail } = response.data;

    const user = {
      id,
      userName,
      email: userEmail,
    };

    setToken(token);
    setUser(user);

    localStorage.setItem('devshelf_token', token);
    localStorage.setItem('devshelf_user', JSON.stringify(user));

    return response.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('devshelf_token');
    localStorage.removeItem('devshelf_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}