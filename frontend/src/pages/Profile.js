import React, { useState, useEffect } from 'react';
import axios from 'axios';

// const API_BASE = 'http://3.142.200.189:8080';
const API_BASE = 'http://localhost:8080';

export default function Profile() {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/user/me`, { headers });
        setUser(res.data);
        setComments(res.data.comments || []);
        setName(res.data.name);
        setEmail(res.data.email);
        setPhoneNumber(res.data.phoneNumber);
        setCity(res.data.city);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const updateUserDetails = async () => {
    try {
      const payload = { name, phoneNumber, city };
      await axios.put(`${API_BASE}/user/me`, payload, { headers });
      setUser({ ...user, name, phoneNumber, city });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating user details:', err);
      setError('Failed to update profile. Please try again later.');
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) {
      alert('Comment cannot be empty');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/user/me/comments`, { text: newComment }, { headers });
      setComments([...comments, res.data.comment]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {error && <div className="mb-4 text-red-500 bg-red-100 rounded p-2">{error}</div>}
      {user && (
        <div className="card flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-4xl text-white shadow-lg mb-4 border-4 border-white dark:border-gray-800">
            {user.name[0]}
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{user.name}</div>
          <div className="text-gray-500 dark:text-gray-300">{user.city}</div>
          <div className="mt-4 space-y-1 text-center">
            <div className="text-gray-700 dark:text-gray-200"><b>Email:</b> {user.email}</div>
            <div className="text-gray-700 dark:text-gray-200"><b>Phone Number:</b> {user.phoneNumber}</div>
            <div className="text-gray-700 dark:text-gray-200"><b>City:</b> {user.city}</div>
          </div>
          {isEditing ? (
            <div className="w-full mt-4">
              <div className="mb-2">
                <label className="block text-gray-700 dark:text-gray-200 mb-1">Name</label>
                <input className="input w-full" type="text" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 dark:text-gray-200 mb-1">Email</label>
                <input className="input w-full" type="email" value={email} readOnly />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 dark:text-gray-200 mb-1">Phone Number</label>
                <input className="input w-full" type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 dark:text-gray-200 mb-1">City</label>
                <input className="input w-full" type="text" value={city} onChange={e => setCity(e.target.value)} />
              </div>
              <button className="btn btn-primary mr-2" onClick={updateUserDetails}>Save Changes</button>
              <button className="btn mt-2" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          ) : (
            <button className="btn btn-primary mt-4" onClick={() => setIsEditing(true)}>Edit Details</button>
          )}
        </div>
      )}

      <div className="mb-2 font-semibold text-lg text-gray-900 dark:text-gray-100">Notes</div>
      {comments.length > 0 ? (
        comments.map(comment => (
          <div key={comment.id} className="bg-gray-100 dark:bg-gray-700 rounded p-3 mb-2">
            <div className="text-gray-800 dark:text-gray-100">{comment.text}</div>
            <div className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleString()}</div>
          </div>
        ))
      ) : (
        <div className="text-gray-400 mb-4">No notes yet.</div>
      )}
      <input
        className="input mt-4 w-full placeholder-gray-400 dark:placeholder-gray-300"
        placeholder="Write your comment here..."
        aria-label="Write your comment here"
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
      />
      <button className="btn btn-primary mt-2" aria-label="Add Note" onClick={addComment}>Add Note</button>

      {/* Footer */}
      <footer className="mt-10 p-4 text-center bg-gray-800 text-gray-100 rounded-lg">
        © 2023 SkillSwap. All rights reserved.
      </footer>
    </div>
  );
}