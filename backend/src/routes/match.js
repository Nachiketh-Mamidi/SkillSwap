const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  const me = await db.collection('users').doc(req.user.id).get();
  const meData = me.data();

  const users = await db.collection('users').get();
  const matches = [];

  users.forEach(doc => {
    if (doc.id === req.user.id) return;
    const u = doc.data();
    const teaches = u.teachSkills.some(skill => meData.learnSkills.includes(skill));
    const learns = u.learnSkills.some(skill => meData.teachSkills.includes(skill));
    if (teaches && learns) matches.push({ id: doc.id, username: u.username });
  });

  res.json(matches);
});

module.exports = router;
