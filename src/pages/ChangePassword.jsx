import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@material-ui/core';
import axios from '../api/axios';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password must match');
      return;
    }

    try {
      const response = await axios.post('/change-password', {
          currentPassword,
          newPassword
        }, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (response.status !== 200) {
        const data = await response.json();
        setPasswordError(data.message);
        return;
      }

      setPasswordError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError('Error in changing password');
      console.error(error);
    }
  };


  return (
    <Box>

      <Typography variant='h5'>Change Password</Typography>

      <TextField
        autoFocus
        margin='dense'
        label='Current Password'
        type='password'
        fullWidth
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <TextField
        margin='dense'
        label='New Password'
        type='password'
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <TextField
        margin='dense'
        label='Confirm Password'
        type='password'
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {passwordError && <p>{passwordError}</p>}
      <Button
        variant='contained'
        color='primary' onClick={handlePasswordChange}>
        Change Password
      </Button>
    </Box>


  );
};

export default ChangePasswordPage;
