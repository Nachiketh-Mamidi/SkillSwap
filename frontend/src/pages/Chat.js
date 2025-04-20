import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';

// const API_BASE = 'http://localhost:8080';
const API_BASE = 'http://3.143.5.51:8080'; // Replace with your backend URL

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { chatId } = location.state || {};

  // State management
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(chatId || null);
  const [skillsToTeach, setSkillsToTeach] = useState([]); // Skills you can teach
  const [skillsToLearn, setSkillsToLearn] = useState([]); // Skills you can learn

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/user/me`, { headers });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
      }
    };

    fetchUser();
  }, []);

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/chat`, { headers });
        setChats(res.data);

        // Automatically select the first chat if no chatId is provided
        if (!selectedChatId && res.data.length > 0) {
          setSelectedChatId(res.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError('Failed to load chats. Please try again later.');
      }
    };

    fetchChats();
  }, [selectedChatId]);

  // Fetch messages and calculate skills for the selected chat
  useEffect(() => {
    const fetchChatDetails = async () => {
      if (!selectedChatId || !user) return;

      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/chat/${selectedChatId}`, { headers });
        setMessages(res.data.messages);

        // Find the other participant
        const otherParticipant = res.data.participants.find((p) => p.id !== user.id);

        if (otherParticipant) {
          // Calculate skills you can teach and learn
          const skillsYouCanTeach = (user.teachSkills || []).filter((skill) =>
            otherParticipant.learnSkills.includes(skill)
          );
          const skillsYouCanLearn = (otherParticipant.teachSkills || []).filter((skill) =>
            user.learnSkills.includes(skill)
          );

          setSkillsToTeach(skillsYouCanTeach);
          setSkillsToLearn(skillsYouCanLearn);
        } else {
          console.warn('No other participant found in the chat');
          setSkillsToTeach([]);
          setSkillsToLearn([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching chat details:', err);
        setError('Failed to load chat details. Please try again later.');
        setLoading(false);
      }
    };

    fetchChatDetails();
  }, [selectedChatId, user]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) {
      alert('Message cannot be empty');
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/chat/${selectedChatId}/messages`,
        { message: newMessage },
        { headers }
      );
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again later.');
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="h4" gutterBottom>
        Chat
      </Typography>
      <Box display="flex" flex={1} border="1px solid #ccc" borderRadius="8px" overflow="hidden">
        {/* Left Sidebar: Chat List */}
        <Box
          width="30%"
          bgcolor="#f8f9fa"
          borderRight="1px solid #ccc"
          display="flex"
          flexDirection="column"
        >
          <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #ccc' }}>
            Chats
          </Typography>
          <List sx={{ flex: 1, overflowY: 'auto' }}>
            {chats.map((chat) => {
              const otherParticipant = chat.participants.find((p) => p.id !== user?.id);
              return (
                <ListItem
                  key={chat.id}
                  button
                  selected={chat.id === selectedChatId}
                  onClick={() => setSelectedChatId(chat.id)}
                  sx={{
                    backgroundColor: chat.id === selectedChatId ? '#e3f2fd' : 'inherit', // Highlight selected chat
                    '&:hover': {
                      backgroundColor: '#f1f1f1', // Add hover effect
                    },
                    borderLeft: chat.id === selectedChatId ? '4px solid #007bff' : 'none', // Add a border for selected chat
                  }}
                >
                  <ListItemText
                    primary={otherParticipant?.name || 'Unknown'}
                    secondary={chat.messages?.[chat.messages.length - 1]?.message || 'No messages yet'}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Right Section: Chat Messages */}
        <Box flex={1} display="flex" flexDirection="column">
          {/* Skills Section */}
          <Box p={2} bgcolor="#f1f1f1" borderBottom="1px solid #ccc">
            <Typography variant="subtitle1" gutterBottom>
              Skills You Can Teach:
            </Typography>
            {skillsToTeach.length > 0 ? (
              skillsToTeach.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="success"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))
            ) : (
              <Typography color="textSecondary">No skills to teach.</Typography>
            )}
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Skills You Can Learn:
            </Typography>
            {skillsToLearn.length > 0 ? (
              skillsToLearn.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="primary"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))
            ) : (
              <Typography color="textSecondary">No skills to learn.</Typography>
            )}
          </Box>

          {/* Chat Messages */}
          <Box flex={1} overflow="auto" p={2} bgcolor="#fff">
            {messages.map((msg, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={msg.senderId === user?.id ? 'flex-start' : 'flex-end'}
                mb={1}
              >
                <Paper
                  elevation={2}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: msg.senderId === user?.id ? '#ffffff' : '#007bff',
                    color: msg.senderId === user?.id ? '#000000' : '#ffffff',
                    borderRadius: '16px',
                    maxWidth: '70%',
                  }}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                  <Typography
                    variant="caption"
                    style={{
                      display: 'block',
                      marginTop: '4px',
                      textAlign: msg.senderId === user?.id ? 'right' : 'left',
                      color: msg.senderId === user?.id ? '#888#cce7ff' : '',
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* Input Box */}
          <Box p={2} borderTop="1px solid #ccc" bgcolor="#f8f9fa">
            <TextField
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              variant="outlined"
              size="small"
            />
            <Button
              onClick={sendMessage}
              variant="contained"
              color="primary"
              style={{ marginTop: '8px', float: 'right' }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 3,
          mt: 'auto',
          backgroundColor: '#343a40',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">© 2025 SkillSwap. All rights reserved.</Typography>
      </Box>
    </Container>
  );
}