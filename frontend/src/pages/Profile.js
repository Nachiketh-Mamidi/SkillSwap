import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';

const API_BASE = 'http://3.142.200.189:8080';
// const API_BASE = 'http://localhost:8080';

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
      const payload = { name, phoneNumber, city }; // Include name, phoneNumber, and city
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
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      {error && <Alert variant="danger">{error}</Alert>}
      {user && (
        <Card className="p-4 shadow-lg" style={{ borderRadius: '15px', background: 'linear-gradient(to right, #e3f2fd, #ffffff)' }}>
          <Row>
            <Col md={4} className="text-center">
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  backgroundColor: '#007bff',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '2rem',
                  margin: '0 auto',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                {user.name[0]}
              </div>
              <h3 className="mt-3">{user.name}</h3>
              <p className="text-muted">{user.city}</p>
            </Col>
            <Col md={8}>
              {isEditing ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      readOnly // Make Email field read-only
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="success" onClick={updateUserDetails} className="me-2">
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                  <p><strong>City:</strong> {user.city}</p>
                  <Button variant="primary" onClick={() => setIsEditing(true)}>
                    Edit Details
                  </Button>
                </>
              )}
            </Col>
          </Row>
        </Card>
      )}

      <h4 className="mt-5">Notes</h4>
      <Row>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Col md={12} key={comment.id} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Text>{comment.text}</Card.Text>
                  <small className="text-muted">{new Date(comment.timestamp).toLocaleString()}</small>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>Add notes</p>
        )}
      </Row>

      <Form className="mt-4">
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
          />
        </Form.Group>
        <Button onClick={addComment} variant="primary">
          Add Note
        </Button>
      </Form>

      {/* Footer */}
      <footer
        style={{
          marginTop: '50px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#343a40',
          color: 'white',
          borderRadius: '10px',
        }}
      >
        <p>© 2023 SkillSwap. All rights reserved.</p>
      </footer>
    </Container>
  );
}