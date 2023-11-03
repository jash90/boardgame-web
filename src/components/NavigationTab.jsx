import { Box } from '@material-ui/core';
import { Logout, ManageAccounts, Password } from '@mui/icons-material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Games } from '@material-ui/icons';
import logout from '../functions/logout';
import NavigationButton from './NavigationButton';

function NavigationTab() {
  const navigate = useNavigate();

  const navigateToManageUsers = () => {
    navigate('/manage-users');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleListGames = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        margin: '20px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}
    >
      <NavigationButton
        icon={<Games />}
        onClick={handleListGames}
      >
        List Ganes
      </NavigationButton>
      <NavigationButton
        icon={<ManageAccounts />}
        onClick={navigateToManageUsers}
      >
        Manage Users
      </NavigationButton>
      <NavigationButton
        onClick={handleChangePassword}
        icon={<Password />}
      >
        Change Password
      </NavigationButton>
      <NavigationButton
        secondary
        onClick={logout}
        icon={<Logout />}
      >
        Logout
      </NavigationButton>
    </Box>
  );
}

export default NavigationTab;
