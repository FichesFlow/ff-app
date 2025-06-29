import React from 'react';
import Button from '@mui/material/Button';
import {useAuth} from '../../context/AuthContext.jsx';

export default function LoginButtonTest() {
  const {login, loading} = useAuth();

  const handleLogin = () => {
    login('user@example.com', 'password123');
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleLogin}
      disabled={loading}
    >
      {loading ? 'Logging in...' : 'Login'}
    </Button>
  );
}