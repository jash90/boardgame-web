import React, { useCallback, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { currentUserAtom } from '../jotai/models';
import axios from '../api/axios';

function AuthRoute() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const navigateToComponent = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Failed to load user data:', error);
      navigate('/login');
    }
  }, [navigate, setCurrentUser]);

  useEffect(() => {
    navigateToComponent().then();
  }, [currentUser?.id, navigateToComponent]);

  return <Outlet />;
}

export default AuthRoute;
