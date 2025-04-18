import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';

const NavigationBar = ({ isAuthenticated, onSignOut }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Navbar.Brand href="/">SkillSwap</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {isAuthenticated && <Nav.Link href="/home">Home</Nav.Link>}
          {isAuthenticated && <Nav.Link href="/profile">Profile</Nav.Link>}
          {!isAuthenticated && <Nav.Link href="/login">Login</Nav.Link>}
        </Nav>
        {isAuthenticated && (
          <Button variant="outline-light" onClick={onSignOut}>
            Sign Out
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;