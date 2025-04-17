import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'https://your-cloud-run-url.com'; // Replace with your backend URL

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [teachSkills, setTeachSkills] = useState('');
  const [learnSkills, setLearnSkills] = useState('');
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);

  const signup = async () => {
    const res = await axios.post(`${API_BASE}/auth/signup`, { username, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const login = async () => {
    const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const fetchProfile = async () => {
    const res = await axios.get(`${API_BASE}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProfile(res.data);
  };

  const updateSkills = async () => {
    await axios.put(
      `${API_BASE}/user/me`,
      { teachSkills: teachSkills.split(','), learnSkills: learnSkills.split(',') },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchProfile();
  };

  const fetchMatches = async () => {
    const res = await axios.get(`${API_BASE}/match`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMatches(res.data);
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  return (
    <div className="App">
      <h1>SkillBarter</h1>

      {!token && (
        <div>
          <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button onClick={signup}>Sign Up</button>
          <button onClick={login}>Log In</button>
        </div>
      )}

      {token && profile && (
        <div>
          <h2>Welcome, {profile.username}</h2>
          <p>Teach Skills: {profile.teachSkills.join(', ')}</p>
          <p>Learn Skills: {profile.learnSkills.join(', ')}</p>

          <input placeholder="Teach Skills (comma-separated)" onChange={e => setTeachSkills(e.target.value)} />
          <input placeholder="Learn Skills (comma-separated)" onChange={e => setLearnSkills(e.target.value)} />
          <button onClick={updateSkills}>Update Skills</button>

          <h3>Matches</h3>
          <button onClick={fetchMatches}>Find Matches</button>
          <ul>
            {matches.map(match => (
              <li key={match.id}>{match.username}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;