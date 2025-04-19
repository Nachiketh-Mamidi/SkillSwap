const express = require('express');
const db = require('../db');
const router = express.Router();

// Fetch all chats for the logged-in user
router.get('/', async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user.id;

    const chats = await db.collection('chats')
      .where('participants', 'array-contains', userId)
      .get();

    const chatList = await Promise.all(
      chats.docs.map(async (doc) => {
        const chatData = doc.data();

        // Fetch participant details
        const participantDetails = await Promise.all(
          chatData.participants.map(async (participantId) => {
            const userDoc = await db.collection('users').doc(participantId).get();
            if (!userDoc.exists) {
              return { id: participantId, name: 'Unknown' };
            }
            return { id: participantId, name: userDoc.data().name || 'Unknown' };
          })
        );

        return { id: doc.id, ...chatData, participants: participantDetails };
      })
    );

    res.json(chatList);
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or fetch a chat between two users
router.post('/', async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { recipientId } = req.body;
    const senderId = req.user.id;

    if (!recipientId) {
      return res.status(400).json({ error: 'Recipient ID is required' });
    }

    const participants = [senderId, recipientId].sort();

    const existingChats = await db
      .collection('chats')
      .where('participants', '==', participants)
      .get();

    let chatId;
    if (!existingChats.empty) {
      chatId = existingChats.docs[0].id;
    } else {
      const newChat = {
        participants,
        messages: [],
        createdAt: new Date().toISOString(),
      };
      const chatRef = await db.collection('chats').add(newChat);
      chatId = chatRef.id;
    }

    res.json({ chatId });
  } catch (err) {
    console.error('Error creating or fetching chat:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch messages for a specific chat
router.get('/:chatId', async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { chatId } = req.params;

    const chatDoc = await db.collection('chats').doc(chatId).get();
    if (!chatDoc.exists) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const chatData = chatDoc.data();

    const participants = await Promise.all(
      chatData.participants.map(async (participantId) => {
        const userDoc = await db.collection('users').doc(participantId).get();
        if (!userDoc.exists) {
          return { id: participantId, name: 'Unknown', teachSkills: [], learnSkills: [] };
        }
        const userData = userDoc.data();
        return {
          id: participantId,
          name: userData.name || 'Unknown',
          teachSkills: userData.teachSkills || [],
          learnSkills: userData.learnSkills || [],
        };
      })
    );

    res.json({ ...chatData, participants });
  } catch (err) {
    console.error('Error fetching chat details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new message to a chat
router.post('/:chatId/messages', async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { chatId } = req.params;
    const { message } = req.body;
    const senderId = req.user.id;

    if (!message || typeof message !== 'string' || message.trim().length === 0 || message.length > 500) {
      return res.status(400).json({ error: 'Invalid message' });
    }

    const chatRef = db.collection('chats').doc(chatId);
    const chatDoc = await chatRef.get();

    if (!chatDoc.exists) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const newMessage = {
      senderId,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    await chatRef.update({
      messages: [...chatDoc.data().messages, newMessage],
    });

    res.json(newMessage);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;