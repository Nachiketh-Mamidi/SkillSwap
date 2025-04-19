const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function removeInvalidUsers() {
  try {
    const usersSnapshot = await db.collection('users').get();

    const batch = db.batch();
    let count = 0;

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (!userData.name || userData.name.trim() === '') {
        console.log(`Deleting user with ID: ${doc.id}`);
        batch.delete(doc.ref);
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
      console.log(`${count} invalid users removed successfully.`);
    } else {
      console.log('No invalid users found.');
    }
  } catch (err) {
    console.error('Error removing invalid users:', err);
  }
}

removeInvalidUsers();