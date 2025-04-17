import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const API_BASE = 'http://localhost:8080';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async () => {
    const endpoint = isSignup ? '/auth/signup' : '/auth/login';
    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, { username, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/home';
    } catch (err) {
      setError(err.response?.data?.error || 'Auth failed');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="text-center mb-4">{isSignup ? 'Sign Up' : 'Log In'} to SkillBarter</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" onClick={handleAuth} className="w-100">
          {isSignup ? 'Sign Up' : 'Log In'}
        </Button>
        <div className="text-center mt-3">
          <Button variant="link" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Already have an account? Log in' : 'No account? Sign up'}
          </Button>
        </div>
      </Form>
    </Container>
  );
}