import React, { useState } from 'react';
import axios from 'axios';

// const API_BASE = 'http://3.142.200.189:8080';
const API_BASE = 'http://localhost:8080';

function SkillSwapLogo() {
  return (
    <div className="flex flex-col items-center mb-6 select-none">
      <div className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg mb-2">
        <span>S</span>
      </div>
      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400 tracking-wide">SkillSwap</span>
    </div>
  );
}

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
      ? { email, password, name }
      : { email, password };
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <SkillSwapLogo />
      <div className="card w-full max-w-md mx-auto">
        <div className="heading text-center mb-4">{isSignup ? 'Sign Up' : 'Log In'} to SkillSwap</div>
        {error && <div className="mb-2 text-red-500 bg-red-100 rounded p-2 text-center">{error}</div>}
        {isSignup && (
          <input
            className="input w-full mb-3"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}
        <input
          className="input w-full mb-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="input w-full mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="btn btn-primary w-full mt-2"
          onClick={handleAuth}
          disabled={loading}
        >
          {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Log In'}
        </button>
        <div
          className="text-sm text-primary-600 dark:text-primary-400 text-center mt-4 cursor-pointer hover:underline"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? 'Already have an account? Log in' : 'No account? Sign up'}
        </div>
      </div>
    </div>
  );
}