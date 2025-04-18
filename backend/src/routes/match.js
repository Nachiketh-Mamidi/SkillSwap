const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const me = await db.collection('users').doc(req.user.id).get();
    if (!me.exists) return res.status(404).json({ error: 'User not found' });

    const meData = me.data();
    const users = await db.collection('users').get();
    const matches = [];

    users.forEach(doc => {
      if (doc.id === req.user.id) return; // Skip the current user
      const u = doc.data();

      // Find matching skills
      const matchingTeachSkills = u.teachSkills.filter(skill => meData.learnSkills.includes(skill));
      const matchingLearnSkills = u.learnSkills.filter(skill => meData.teachSkills.includes(skill));

      if (matchingTeachSkills.length > 0 || matchingLearnSkills.length > 0) {
        matches.push({
          id: doc.id,
          name: u.name, // Include the name field
          email: u.email, // Include the email field
          teachSkills: u.teachSkills, // All skills the user can teach
          learnSkills: u.learnSkills, // All skills the user wants to learn
          matchingTeachSkills, // Skills this user can teach that match the current user's learn skills
          matchingLearnSkills // Skills this user wants to learn that match the current user's teach skills
        });
      }
    });

    res.json(matches);
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;