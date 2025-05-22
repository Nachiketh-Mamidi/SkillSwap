import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const API_BASE = 'http://3.142.200.189:8080';
const API_BASE = 'http://localhost:8080';

export default function Home() {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [user, setUser] = useState(null);
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/user/me`, { headers });
        setUser(res.data);
        setTeachSkills(res.data.teachSkills || []);
        setLearnSkills(res.data.learnSkills || []);
      } catch (err) {
        if (err.response?.data?.error === 'Token expired') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setError('Failed to fetch user data');
        }
      }
    };
    fetchUser();
  }, []);

  const updateSkills = async () => {
    try {
      const payload = {
        teachSkills: teachSkills || [],
        learnSkills: learnSkills || [],
      };
      await axios.put(`${API_BASE}/user/me`, payload, { headers });
      alert('Skills updated');
    } catch (err) {
      setError('Failed to update skills');
    }
  };

  const findMatches = async () => {
    try {
      const res = await axios.get(`${API_BASE}/match`, { headers });
      setMatches(res.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch matches');
    }
  };

  const handleConnect = async (recipientId) => {
    try {
      const res = await axios.post(
        `${API_BASE}/chat`,
        { recipientId },
        { headers }
      );
      navigate('/chat', { state: { chatId: res.data.chatId } });
    } catch (err) {
      alert('Failed to connect. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {error && <div className="mb-4 text-red-500 bg-red-100 rounded p-2">{error}</div>}
      {/* Hero Section */}
      <div className="card text-center mb-8">
        <div className="heading">Welcome, {user?.name || 'User'}!</div>
        <div className="subheading">Ready to swap skills and learn something new today?</div>
      </div>
      {/* Skills Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Skills You Can Teach</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {teachSkills.length > 0 ? (
              teachSkills.map((skill, idx) => (
                <span key={idx} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs">{skill}</span>
              ))
            ) : (
              <span className="text-gray-400 text-xs">No skills added yet.</span>
            )}
          </div>
          <input
            className="input w-full placeholder-gray-400 dark:placeholder-gray-300"
            placeholder="Add Skills You Can Teach (comma separated)"
            value={teachSkills.join(', ')}
            onChange={e => setTeachSkills(e.target.value.split(',').map(s => s.trim()))}
          />
        </div>
        <div className="card">
          <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Skills You Want to Learn</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {learnSkills.length > 0 ? (
              learnSkills.map((skill, idx) => (
                <span key={idx} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs">{skill}</span>
              ))
            ) : (
              <span className="text-gray-400 text-xs">No skills added yet.</span>
            )}
          </div>
          <input
            className="input w-full placeholder-gray-400 dark:placeholder-gray-300"
            placeholder="Add Skills You Want to Learn (comma separated)"
            value={learnSkills.join(', ')}
            onChange={e => setLearnSkills(e.target.value.split(',').map(s => s.trim()))}
          />
        </div>
      </div>
      {/* Actions */}
      <div className="flex gap-4 justify-center mb-8">
        <button className="btn btn-primary" onClick={updateSkills}>Update Skills</button>
        <button className="btn btn-primary" onClick={findMatches}>Find Matches</button>
      </div>
      {/* Matches Section */}
      <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-4 text-center">Matches</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match.id} className="card flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-2xl text-white shadow-lg mb-2">
                {match.name?.[0] || '?'}
              </div>
              <div className="font-bold text-gray-900 dark:text-gray-100">{match.name || 'Unknown'}</div>
              <div className="text-gray-500 dark:text-gray-300 text-sm mb-2">{match.email || 'No email provided'}</div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mt-2">Skills They Can Teach:</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {match.teachSkills?.length > 0 ? (
                  match.teachSkills.map((skill, idx) => (
                    <span key={idx} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs">{skill}</span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">No skills listed</span>
                )}
              </div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mt-2">Skills They Want to Learn:</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {match.learnSkills?.length > 0 ? (
                  match.learnSkills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs">{skill}</span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">No skills listed</span>
                )}
              </div>
              <button className="btn btn-primary mt-2 w-full" onClick={() => handleConnect(match.id)}>Connect</button>
            </div>
          ))
        ) : (
          <div className="text-gray-400 col-span-full text-center">No matches found yet. Click 'Find Matches' to get started!</div>
        )}
      </div>
      {/* Footer */}
      <footer className="mt-10 p-4 text-center bg-gray-800 text-gray-100 rounded-lg">
        © 2023 SkillSwap. All rights reserved.
      </footer>
    </div>
  );
}