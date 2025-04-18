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
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';

const API_BASE = 'http://18.117.75.10:8080'; 

export default function Home() {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [user, setUser] = useState(null);
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

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
      setMatches(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to fetch matches');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
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
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name || 'User'}!
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Ready to swap skills and learn something new today?
        </Typography>
      </Card>

      {/* Skills Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: '15px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent>
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
            <CardContent>
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
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            startIcon={<Add />}
            onClick={updateSkills}
            sx={{ borderRadius: '20px' }}
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
            sx={{ borderRadius: '20px' }}
          >
            Find Matches
          </Button>
        </Grid>
      </Grid>

      {/* Matches Section */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Matches
      </Typography>
      <Grid container spacing={4}>
        {matches.length > 0 ? (
          matches.map((match) => (
            <Grid item xs={12} md={6} lg={4} key={match.id}>
              <Card
                sx={{
                  borderRadius: '15px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#e3f2fd',
                }}
              >
                <CardContent>
                  <Typography variant="h6">{match.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {match.email}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Skills They Can Teach:
                  </Typography>
                  {match.teachSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      color={match.matchingTeachSkills.includes(skill) ? 'success' : 'default'}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Skills They Want to Learn:
                  </Typography>
                  {match.learnSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      color={match.matchingLearnSkills.includes(skill) ? 'primary' : 'default'}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography color="textSecondary">No matches found yet. Click "Find Matches" to get started!</Typography>
        )}
      </Grid>
    </Container>
  );
}