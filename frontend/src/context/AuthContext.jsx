import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch, resetCsrf } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/profile/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = async (payload) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    setUser(data.user);
  };

  const login = async (payload) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    setUser(data.user);
  };

  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    resetCsrf();
    setUser(null);
  };

  const refreshProfile = async () => {
    const data = await apiFetch('/profile/me');
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
