const express = require('express');
const db = require('../db');
const router = express.Router();
const admin = require('firebase-admin');

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

// updated the user details
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

    // Update skill index
    await updateSkillIndex(req.user.id, req.body.oldTeachSkills || [], req.body.oldLearnSkills || [], req.body.teachSkills, req.body.learnSkills);

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//
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

// add an endpoint to delete
router.delete('/me', async (req, res) => {
    try {
      const userDoc = await db.collection('users').doc(req.user.id).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }
      // see if user exits
      // delete the user from the database
      // delete the resources attached to the use

      // 
      // chats history
      const comments = await userDoc.collection('comments').get();
      const batch = db.batch();
      comments.forEach(comment => {
        batch.delete(comment.ref);
      })

      await batch.commit();
      await userDoc.delete()

      res.json({ message: 'User deleted successfully' });

    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper to get unique user IDs except the current user
const uniqueExcept = (arr, exceptId) => [...new Set(arr.filter(id => id !== exceptId))];

router.get('/', async (req, res) => {
  try {
    const meDoc = await db.collection('users').doc(req.user.id).get();
    if (!meDoc.exists) return res.status(404).json({ error: 'User not found' });
    const me = meDoc.data();

    // 1. Find users who want to learn what I can teach
    let learnMatches = [];
    for (const skill of me.teachSkills || []) {
      const skillDoc = await db.collection('skills').doc(skill).get();
      if (skillDoc.exists) {
        learnMatches.push(...(skillDoc.data().learners || []));
      }
    }

    // 2. Find users who can teach what I want to learn
    let teachMatches = [];
    for (const skill of me.learnSkills || []) {
      const skillDoc = await db.collection('skills').doc(skill).get();
      if (skillDoc.exists) {
        teachMatches.push(...(skillDoc.data().teachers || []));
      }
    }

    // 3. Combine and deduplicate, exclude self
    const matchUserIds = uniqueExcept([...learnMatches, ...teachMatches], req.user.id);

    // 4. Fetch user profiles and compute matching skills
    const matches = [];
    for (const userId of matchUserIds) {
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) continue;
      const u = userDoc.data();

      // Skills this user can teach me
      const matchingTeachSkills = (u.teachSkills || []).filter(skill => (me.learnSkills || []).includes(skill));
      // Skills this user wants to learn from me
      const matchingLearnSkills = (u.learnSkills || []).filter(skill => (me.teachSkills || []).includes(skill));

      matches.push({
        id: userId,
        name: u.name,
        email: u.email,
        teachSkills: u.teachSkills,
        learnSkills: u.learnSkills,
        matchingTeachSkills,
        matchingLearnSkills
      });
    }

    res.json(matches);
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// In your user update endpoint (e.g., PUT /user/me)
const updateSkillIndex = async (userId, oldTeach, oldLearn, newTeach, newLearn) => {
  // Remove user from old skills
  for (const skill of oldTeach) {
    await db.collection('skills').doc(skill).update({
      teachers: admin.firestore.FieldValue.arrayRemove(userId)
    });
  }
  for (const skill of oldLearn) {
    await db.collection('skills').doc(skill).update({
      learners: admin.firestore.FieldValue.arrayRemove(userId)
    });
  }
  // Add user to new skills
  for (const skill of newTeach) {
    await db.collection('skills').doc(skill).set({
      teachers: admin.firestore.FieldValue.arrayUnion(userId)
    }, { merge: true });
  }
  for (const skill of newLearn) {
    await db.collection('skills').doc(skill).set({
      learners: admin.firestore.FieldValue.arrayUnion(userId)
    }, { merge: true });
  }
};

module.exports = router;