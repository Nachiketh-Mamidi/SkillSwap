const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const users = await db.collection('users').where('username', '==', username).get();
  if (!users.empty) return res.status(400).json({ error: 'Username already exists' });

  const hash = await bcrypt.hash(password, 10);
  const newUser = {
    username,
    passwordHash: hash,
    teachSkills: [],
    learnSkills: []
  };

  const docRef = await db.collection('users').add(newUser);
  const token = jwt.sign({ id: docRef.id, username }, process.env.JWT_SECRET);
  res.json({ token });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const users = await db.collection('users').where('username', '==', username).get();
  if (users.empty) return res.status(400).json({ error: 'Invalid credentials' });

  const userDoc = users.docs[0];
  const user = userDoc.data();
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: userDoc.id, username }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;
