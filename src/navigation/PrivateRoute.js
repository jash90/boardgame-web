import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { currentUserAtom } from '../jotai/models';
import axios from '../api/axios';

function PrivateRoute() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  async function navigateToComponent() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('user');
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Failed to load user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }

  useEffect(() => {
    navigateToComponent();
  }, [currentUser?.id]);

  return <Outlet />;
}

export default PrivateRoute;
