const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if the email already exists
    const users = await db.collection('users').where('email', '==', email).get();
    if (!users.empty) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = {
      email,
      passwordHash: hash,
      name,
      phoneNumber: '',
      city: '',
      teachSkills: [],
      learnSkills: [],
      comments: []
    };

    const docRef = await db.collection('users').add(newUser);
    const token = jwt.sign({ id: docRef.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; // Use email instead of username

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Query the database using email
    const users = await db.collection('users').where('email', '==', email).get();
    if (users.empty) return res.status(400).json({ error: 'Invalid credentials' });

    const userDoc = users.docs[0];
    const user = userDoc.data();

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate a JWT token
    const token = jwt.sign({ id: userDoc.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;