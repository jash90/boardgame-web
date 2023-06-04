import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, makeStyles, TextField } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAtom } from 'jotai/index';
import { currentUserAtom } from '../jotai/models';

const useStyles = makeStyles({
  card: {
    maxWidth: 400,
    margin: '0 auto',
    padding: '20px 30px',
    marginTop: 50
  },
  title: {
    textAlign: 'center',
    marginBottom: 20
  },
  button: {
    marginTop: 20 // Add some margin to the top of the button
  }
});

const Register = () => {
  const classes = useStyles();
  const navigate = useNavigate(); // Add this
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const handleUsernameChange = (e) => {
    setEmail(e.target.value);
    setUsernameError(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  const handleRegister = async () => {
    // Add validation here
    if (email === '') {
      setUsernameError(true);
      return;
    }
    if (password === '') {
      setPasswordError(true);
      return;
    }
    try {
      await axios.post('register', {
        email,
        password
      });

      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToHome = async () => {
    try {
      const { data: userData } = await axios.get(`user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCurrentUser(userData);
      if (userData) {
        navigate('/');
      }
    } catch (e) {}
  };

  useEffect(() => {
    navigateToHome();
  }, []);

  return (
    <Card className={classes.card}>
      <CardContent>
        <h2 className={classes.title}>Register</h2>
        <TextField
          error={usernameError}
          helperText={usernameError ? 'Username is required' : ''}
          label="Email"
          value={email}
          onChange={handleUsernameChange}
          fullWidth
        />
        <TextField
          error={passwordError}
          helperText={passwordError ? 'Password is required' : ''}
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleRegister} fullWidth>
          Register
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/login')}
          className={classes.button}
          fullWidth>
          Login
        </Button>
      </CardContent>
    </Card>
  );
};

export default Register;
