import React from 'react';
import Button from '@mui/material/Button';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LogoutButtonTest() {
  const { logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </Button>
  );
}