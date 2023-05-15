import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Card, CardContent, makeStyles } from '@material-ui/core';
import { useNavigate } from 'react-router-dom'; // Add this

const useStyles = makeStyles({
  card: {
    maxWidth: 400,
    margin: '0 auto',
    padding: '20px 30px',
    marginTop: 50,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 20, // Add some margin to the top of the button
  },
});

const Login = () => {
  const classes = useStyles();
  const navigate = useNavigate(); // Add this
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleUsernameChange = (e) => {
    setEmail(e.target.value);
    setUsernameError(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  const handleLogin = async () => {
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
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);

      setEmail('');
      setPassword('');
      navigate("/")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <h2 className={classes.title}>Login</h2>
        <TextField error={usernameError} helperText={usernameError ? 'Username is required' : ''} label='Username' value={email} onChange={handleUsernameChange} fullWidth />
        <TextField error={passwordError} helperText={passwordError ? 'Password is required' : ''} label='Password' type='password' value={password} onChange={handlePasswordChange} fullWidth />
        <Button variant='contained' color='primary' onClick={handleLogin} fullWidth>
          Login
        </Button>
        <Button variant='outlined' color='primary' onClick={() => navigate('/register')} className={classes.button} fullWidth>
          Register
        </Button>
      </CardContent>
    </Card>
  );
};

export default Login;
