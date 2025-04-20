import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

// const API_BASE = 'http://localhost:8080';
const API_BASE = 'http://18.117.75.10:8080'; // Replace with your backend URL

const NavigationBar = ({ isAuthenticated, onSignOut }) => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserName = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const headers = { Authorization: `Bearer ${token}` };
          const res = await axios.get(`${API_BASE}/user/me`, { headers });
          setUserName(res.data.name || 'User');
        } catch (err) {
          console.error('Error fetching user name:', err);
        }
      }
    };

    fetchUserName();
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        SkillSwap
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {isAuthenticated && <Nav.Link onClick={() => navigate('/home')}>Home</Nav.Link>}
          {isAuthenticated && <Nav.Link onClick={() => navigate('/chat')}>Chat</Nav.Link>}
          {isAuthenticated && <Nav.Link onClick={() => navigate('/profile')}>Profile</Nav.Link>}
          {!isAuthenticated && <Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>}
        </Nav>
        {isAuthenticated && (
          <div className="d-flex align-items-center">
            <span className="text-white me-3">Hello, {userName}</span>
            <Button variant="outline-light" onClick={onSignOut}>
              Sign Out
            </Button>
          </div>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;