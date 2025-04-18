const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/me', async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    res.json({
      id: userDoc.id,
      username: userData.username,
      name: userData.name || '', // Include name
      email: userData.email || '', // Include email
      phoneNumber: userData.phoneNumber || '', // Include phoneNumber
      city: userData.city || '', // Include city
      teachSkills: userData.teachSkills || [], // Default to empty array
      learnSkills: userData.learnSkills || [], // Default to empty array
      comments: userData.comments || [] // Default to empty array
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/me', async (req, res) => {
  try {
    const { name, phoneNumber, city, teachSkills, learnSkills } = req.body;

    // Validate input
    if (name && typeof name !== 'string') {
      return res.status(400).json({ error: 'Name must be a string' });
    }
    if (phoneNumber && typeof phoneNumber !== 'string') {
      return res.status(400).json({ error: 'Phone number must be a string' });
    }
    if (city && typeof city !== 'string') {
      return res.status(400).json({ error: 'City must be a string' });
    }
    if (
      teachSkills &&
      (!Array.isArray(teachSkills) || !teachSkills.every(skill => typeof skill === 'string'))
    ) {
      return res.status(400).json({ error: 'teachSkills must be an array of strings' });
    }
    if (
      learnSkills &&
      (!Array.isArray(learnSkills) || !learnSkills.every(skill => typeof skill === 'string'))
    ) {
      return res.status(400).json({ error: 'learnSkills must be an array of strings' });
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (city) updateData.city = city;
    if (teachSkills) updateData.teachSkills = teachSkills;
    if (learnSkills) updateData.learnSkills = learnSkills;

    // Update user document
    await db.collection('users').doc(req.user.id).update(updateData);
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/me/comments', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const userRef = db.collection('users').doc(req.user.id);
    const commentRef = userRef.collection('comments').doc();
    const comment = {
      id: commentRef.id,
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    await commentRef.set(comment);
    res.json({ message: 'Comment added successfully', comment });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;