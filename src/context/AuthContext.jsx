import {createContext, useContext, useEffect, useReducer} from 'react';
import * as api from '../api/auth.js';

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  login: () => {
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
  console.log(action.type)
  switch (action.type) {
    case 'LOGIN_START':
      return {...state, loading: true, error: null};
    case 'LOGIN_SUCCESS':
      console.log('Login successful:', action.user);
      return {...state, loading: false, user: action.user, token: action.token};
    case 'LOGIN_ERROR':
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
      const {token, user} = await api.login(email, password);
      dispatch({type: 'LOGIN_SUCCESS', user, token});
    } catch {
      dispatch({type: 'LOGIN_ERROR', error: 'Login failed'});
    }
  }

  const logout = () => {
    api.logout();
    dispatch({type: 'LOGOUT'});
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAuthenticated: !!state.token,
        login,
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