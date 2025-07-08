import {createContext, useContext, useEffect, useReducer} from 'react';
import * as api from '../api/auth.js';

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  login: () => {
  },
  register: () => {
  },
  logout: () => {
  },
  loading: false,
  error: null,
});

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) ?? null,
  token: localStorage.getItem('token') ?? null,
  loading: false,
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {...state, loading: true, error: null};
    case 'LOGIN_SUCCESS':
      console.log('Login successful:', action.user);
      return {...state, loading: false, user: action.user, token: action.token};
    case 'REGISTER_SUCCESS':
      return {...state, loading: false, user: action.user, token: action.token, message: action.message};
    case 'LOGIN_ERROR':
    case 'REGISTER_ERROR':
      return {...state, loading: false, error: action.error};
    case 'LOGOUT':
      return {...initialState, user: null, token: null};
    default:
      return state;
  }
}

export function AuthProvider({children}) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  }, [state.token, state.user]);

  const login = async (email, password) => {
    dispatch({type: 'LOGIN_START'});
    try {
      const {token} = await api.login(email, password);
      const user = {"name": "Jean Dupont", "email": email, "avatarUrl": "https://i.pravatar.cc/300"}
      dispatch({type: 'LOGIN_SUCCESS', user, token});
    } catch {
      dispatch({type: 'LOGIN_ERROR', error: 'Login failed'});
    }
  }

  const logout = () => {
    api.logout();
    dispatch({type: 'LOGOUT'});
  }

  const register = async (email, password, username) => {
    dispatch({type: 'REGISTER_START'});
    try {
      await api.register(email, password, username);
      dispatch({
        type: 'REGISTER_SUCCESS',
        user: null,
        token: null,
        message: 'Registration successful. Please log in.'
      });
      return true;
    } catch (error) {
      dispatch({type: 'REGISTER_ERROR', error: 'Registration failed'});
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAuthenticated: !!state.token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};