import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// const API_BASE = 'http://3.142.200.189:8080';
const API_BASE = 'http://localhost:8080';

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { chatId } = location.state || {};

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(chatId || null);
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_BASE}/user/me`, { headers })
      .then(res => setUser(res.data))
      .catch(() => setError('Failed to load user data.'));
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE}/chat`, { headers })
      .then(res => {
        setChats(res.data);
        if (!selectedChatId && res.data.length > 0) setSelectedChatId(res.data[0].id);
        if (res.data.length === 0) setLoading(false);
      })
      .catch(() => {
        setError('Failed to load chats.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedChatId || !user) return;
    setLoading(true);
    axios.get(`${API_BASE}/chat/${selectedChatId}`, { headers })
      .then(res => {
        setMessages(res.data.messages);
        const other = res.data.participants.find(p => p.id !== user.id);
        setSkillsToTeach((user.teachSkills || []).filter(skill => other?.learnSkills?.includes(skill)));
        setSkillsToLearn((other?.teachSkills || []).filter(skill => user.learnSkills?.includes(skill)));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load chat details.');
        setLoading(false);
      });
  }, [selectedChatId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await axios.post(
        `${API_BASE}/chat/${selectedChatId}/messages`,
        { message: newMessage },
        { headers }
      );
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
    } catch {
      toast.error('Failed to send message.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
    <div className="max-w-5xl mx-auto py-8 px-4">
      {error && <div className="mb-4 text-red-500 bg-red-100 rounded p-2">{error}</div>}
      <div className="heading mb-4">Chat</div>
      <div className="flex rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-900 min-h-[60vh]">
        {/* Sidebar */}
        <aside className="w-1/4 min-w-[180px] bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 font-bold text-gray-700 dark:text-primary-400 border-b border-gray-200 dark:border-gray-700">Chats</div>
          <div className="flex-1 overflow-y-auto">
            {chats.length > 0 ? (
              chats.map(chat => {
                const other = chat.participants.find(p => p.id !== user?.id);
                return (
                  <button
                    key={chat.id}
                    className={`w-full text-left px-4 py-3 border-l-4 ${chat.id === selectedChatId
                      ? 'bg-primary-50 dark:bg-primary-900 border-primary-500'
                      : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedChatId(chat.id)}
                  >
                    <div className="font-semibold text-gray-800 dark:text-gray-100">{other?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-400 truncate">{chat.messages?.[chat.messages.length - 1]?.message || 'No messages yet'}</div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-gray-400 text-center">No chats yet.</div>
            )}
          </div>
        </aside>
        {/* Main Chat Area */}
        <section className="flex-1 flex flex-col">
          {/* Skills */}
          <div className="px-6 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
            <div>
              <div className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">Skills You Can Teach:</div>
              <div className="flex flex-wrap gap-2">
                {skillsToTeach.length > 0
                  ? skillsToTeach.map(skill => (
                    <span key={skill} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs">{skill}</span>
                  ))
                  : <span className="text-gray-400 text-xs">None</span>
                }
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">Skills You Can Learn:</div>
              <div className="flex flex-wrap gap-2">
                {skillsToLearn.length > 0
                  ? skillsToLearn.map(skill => (
                    <span key={skill} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs">{skill}</span>
                  ))
                  : <span className="text-gray-400 text-xs">None</span>
                }
              </div>
            </div>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-white dark:bg-gray-900">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">No messages yet. Start the conversation!</div>
            ) : (
              messages.map((msg, idx) => {
                const isSelf = msg.senderId === user?.id;
                return (
                  <div
                    key={idx}
                    className={`flex ${isSelf ? 'justify-end' : 'justify-start'} mb-2 transition-all duration-200`}
                  >
                    <div className={`
                      px-4 py-2 rounded-2xl shadow
                      ${isSelf
                        ? 'bg-primary-500 text-white rounded-br-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                      }
                      max-w-[70%] break-words
                    `}>
                      <div>{msg.message}</div>
                      <div className={`text-xs mt-1 ${isSelf ? 'text-blue-100 text-right' : 'text-gray-400 text-left'}`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input Bar */}
          <form
            className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
            onSubmit={e => { e.preventDefault(); sendMessage(); }}
          >
            <input
              className="flex-1 input placeholder-gray-400 dark:placeholder-gray-300"
              type="text"
              placeholder="Type a message"
              aria-label="Type a message"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-primary"
              aria-label="Send message"
              disabled={!newMessage.trim()}
            >
              Send
            </button>
          </form>
        </section>
      </div>
      {/* Footer */}
      <footer className="mt-10 p-4 text-center bg-gray-800 text-gray-100 rounded-lg">
        © 2023 SkillSwap. All rights reserved.
      </footer>
    </div>
  );
}