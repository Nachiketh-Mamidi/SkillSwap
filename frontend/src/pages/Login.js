import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';

const API_BASE = 'http://3.142.200.189:8080'; 
// const API_BASE = 'http://localhost:8080';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    const endpoint = isSignup ? '/auth/signup' : '/auth/login';
    const payload = isSignup
      ? { email, password, name } // Include name for sign up
      : { email, password }; // Only email and password for login

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, payload);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/home';
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400, p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            {isSignup ? 'Sign Up' : 'Log In'} to SkillSwap
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Form */}
          {isSignup && (
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Corrected handler
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleAuth}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : isSignup ? 'Sign Up' : 'Log In'}
          </Button>

          {/* Toggle between Login and Signup */}
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, cursor: 'pointer', color: 'primary.main' }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
              ? 'Already have an account? Log in'
              : 'No account? Sign up'}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}