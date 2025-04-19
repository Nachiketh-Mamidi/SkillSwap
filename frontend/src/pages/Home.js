import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  TextField,
  Alert,
  Box,
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const API_BASE = 'http://localhost:8080';

export default function Home() {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [user, setUser] = useState(null);
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

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
      setMatches(res.data || []); // Ensure matches is always an array
      setError(null);
    } catch (err) {
      console.error('Error fetching matches:', err);
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
      console.error('Error creating or fetching chat:', err);
      alert('Failed to connect. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ mt: 4, flex: 1 }}>
        {error && <Alert severity="error">{error}</Alert>}

        {/* Hero Section */}
        <Card
          sx={{
            mb: 4,
            p: 3,
            textAlign: 'center',
            backgroundColor: '#e3f2fd',
            borderRadius: '15px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome, {user?.name || 'User'}!
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Ready to swap skills and learn something new today?
          </Typography>
        </Card>

        {/* Skills Section */}
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: '15px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Skills You Can Teach
                </Typography>
                {teachSkills.length > 0 ? (
                  teachSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      color="success"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))
                ) : (
                  <Typography color="textSecondary">No skills added yet.</Typography>
                )}
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Add Skills You Can Teach"
                  value={teachSkills.join(', ')}
                  onChange={(e) => setTeachSkills(e.target.value.split(',').map((s) => s.trim()))}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: '15px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Skills You Want to Learn
                </Typography>
                {learnSkills.length > 0 ? (
                  learnSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      color="primary"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))
                ) : (
                  <Typography color="textSecondary">No skills added yet.</Typography>
                )}
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Add Skills You Want to Learn"
                  value={learnSkills.join(', ')}
                  onChange={(e) => setLearnSkills(e.target.value.split(',').map((s) => s.trim()))}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Actions */}
        <Grid container spacing={2} sx={{ mt: 3 }} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              color="success"
              startIcon={<Add />}
              onClick={updateSkills}
              sx={{
                borderRadius: '20px',
                background: 'linear-gradient(to right, #4caf50, #81c784)',
                '&:hover': {
                  background: 'linear-gradient(to right, #388e3c, #66bb6a)',
                },
              }}
            >
              Update Skills
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Search />}
              onClick={findMatches}
              sx={{
                borderRadius: '20px',
                background: 'linear-gradient(to right, #2196f3, #64b5f6)',
                '&:hover': {
                  background: 'linear-gradient(to right, #1976d2, #42a5f5)',
                },
              }}
            >
              Find Matches
            </Button>
          </Grid>
        </Grid>

        {/* Matches Section */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
          Matches
        </Typography>
        <Grid container spacing={4}>
          {matches.length > 0 ? (
            matches.map((match) => (
              <Grid item xs={12} sm={6} md={4} key={match.id}>
                <Card
                  sx={{
                    borderRadius: '15px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <CardContent>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        margin: '0 auto',
                        mb: 2,
                        backgroundColor: '#007bff',
                        fontSize: '2rem',
                      }}
                    >
                      {match.name?.[0] || '?'}
                    </Avatar>
                    <Typography variant="h6" align="center">
                      {match.name || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center">
                      {match.email || 'No email provided'}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                      Skills They Can Teach:
                    </Typography>
                    {match.teachSkills?.length > 0 ? (
                      match.teachSkills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          color="success"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))
                    ) : (
                      <Typography color="textSecondary">No skills listed</Typography>
                    )}
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                      Skills They Want to Learn:
                    </Typography>
                    {match.learnSkills?.length > 0 ? (
                      match.learnSkills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          color="primary"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))
                    ) : (
                      <Typography color="textSecondary">No skills listed</Typography>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2, borderRadius: '20px' }}
                      onClick={() => handleConnect(match.id)} // Pass recipientId to handleConnect
                    >
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography color="textSecondary" sx={{ textAlign: 'center', width: '100%' }}>
              No matches found yet. Click "Find Matches" to get started!
            </Typography>
          )}
        </Grid>
      </Container>
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
      <Typography variant="body2">© 2023 SkillSwap. All rights reserved.</Typography>
    </Box>
    </Box>
  );
}