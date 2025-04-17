const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/me', async (req, res) => {
  const user = await db.collection('users').doc(req.user.id).get();
  res.json({ id: user.id, ...user.data() });
});

router.put('/me', async (req, res) => {
  const { teachSkills, learnSkills } = req.body;
  await db.collection('users').doc(req.user.id).update({ teachSkills, learnSkills });
  res.json({ message: 'Profile updated' });
});

module.exports = router;
