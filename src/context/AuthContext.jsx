import React, {createContext, useContext, useState} from 'react';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {
  },
  logout: () => {
  },
  register: () => {
  },
  loading: false,
  error: null,
});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Replace with real API call
      setUser({email});
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Replace with real API call
      setUser({email});
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;