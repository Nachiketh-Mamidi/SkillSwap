
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Card, Badge } from 'react-bootstrap';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

const API_BASE = 'http://localhost:8080';

export default function Home() {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [user, setUser] = useState(null);
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/user/me`, { headers }).then(res => {
      setUser(res.data);
      setTeachSkills(res.data.teachSkills || []);
      setLearnSkills(res.data.learnSkills || []);
    });
  }, []);

  const updateSkills = () => {
    axios.put(`${API_BASE}/user/me`, { teachSkills, learnSkills }, { headers })
      .then(() => alert('Skills updated'));
  };

  const findMatches = () => {
    axios.get(`${API_BASE}/match`, { headers }).then(res => setMatches(res.data));
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Welcome, {user?.username}</h2>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Skills You Can Teach</Form.Label>
            <TagsInput value={teachSkills} onChange={setTeachSkills} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Skills You Want to Learn</Form.Label>
            <TagsInput value={learnSkills} onChange={setLearnSkills} />
          </Form.Group>
        </Col>
      </Row>

      <Button variant="success" onClick={updateSkills} className="me-2">Update Skills</Button>
      <Button variant="primary" onClick={findMatches}>Find Matches</Button>

      <h4 className="mt-4">Matches</h4>
      <Row>
        {matches.map(m => (
          <Col md={4} key={m.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{m.username}</Card.Title>
                <Badge bg="info">Skill Match</Badge>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
