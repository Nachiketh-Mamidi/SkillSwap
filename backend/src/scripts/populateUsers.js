const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const serviceAccount = require('../../serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Default password for all accounts
const defaultPassword = 'Test@123';

// List of users with teach and learn skills
const users = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    teachSkills: ['JavaScript', 'React', 'Node.js', 'HTML'],
    learnSkills: ['Python', 'Django', 'Flask', 'SQL'],
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    teachSkills: ['Python', 'Django', 'Flask', 'SQL'],
    learnSkills: ['JavaScript', 'React', 'Node.js', 'HTML'],
  },
  {
    name: 'Charlie',
    email: 'charlie@example.com',
    teachSkills: ['Java', 'Spring', 'Hibernate', 'Maven'],
    learnSkills: ['C++', 'Data Structures', 'Algorithms', 'Linux'],
  },
  {
    name: 'David',
    email: 'david@example.com',
    teachSkills: ['C++', 'Data Structures', 'Algorithms', 'Linux'],
    learnSkills: ['Java', 'Spring', 'Hibernate', 'Maven'],
  },
  {
    name: 'Eve',
    email: 'eve@example.com',
    teachSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    learnSkills: ['Azure', 'GCP', 'CI/CD', 'DevOps'],
  },
  {
    name: 'Frank',
    email: 'frank@example.com',
    teachSkills: ['Azure', 'GCP', 'CI/CD', 'DevOps'],
    learnSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
  },
  {
    name: 'Grace',
    email: 'grace@example.com',
    teachSkills: ['Photoshop', 'Illustrator', 'Figma', 'Sketch'],
    learnSkills: ['After Effects', 'Premiere Pro', '3D Modeling', 'Animation'],
  },
  {
    name: 'Hank',
    email: 'hank@example.com',
    teachSkills: ['After Effects', 'Premiere Pro', '3D Modeling', 'Animation'],
    learnSkills: ['Photoshop', 'Illustrator', 'Figma', 'Sketch'],
  },
  {
    name: 'Ivy',
    email: 'ivy@example.com',
    teachSkills: ['SQL', 'NoSQL', 'MongoDB', 'PostgreSQL'],
    learnSkills: ['Redis', 'Elasticsearch', 'Cassandra', 'BigQuery'],
  },
  {
    name: 'Jack',
    email: 'jack@example.com',
    teachSkills: ['Redis', 'Elasticsearch', 'Cassandra', 'BigQuery'],
    learnSkills: ['SQL', 'NoSQL', 'MongoDB', 'PostgreSQL'],
  },
  {
    name: 'Kate',
    email: 'kate@example.com',
    teachSkills: ['Git', 'GitHub', 'GitLab', 'Bitbucket'],
    learnSkills: ['Jenkins', 'CircleCI', 'TravisCI', 'TeamCity'],
  },
  {
    name: 'Leo',
    email: 'leo@example.com',
    teachSkills: ['Jenkins', 'CircleCI', 'TravisCI', 'TeamCity'],
    learnSkills: ['Git', 'GitHub', 'GitLab', 'Bitbucket'],
  },
  {
    name: 'Mia',
    email: 'mia@example.com',
    teachSkills: ['HTML', 'CSS', 'Bootstrap', 'Tailwind'],
    learnSkills: ['JavaScript', 'TypeScript', 'React', 'Vue.js'],
  },
  {
    name: 'Nina',
    email: 'nina@example.com',
    teachSkills: ['JavaScript', 'TypeScript', 'React', 'Vue.js'],
    learnSkills: ['HTML', 'CSS', 'Bootstrap', 'Tailwind'],
  },
  {
    name: 'Oscar',
    email: 'oscar@example.com',
    teachSkills: ['Linux', 'Bash', 'Shell Scripting', 'System Administration'],
    learnSkills: ['Windows', 'PowerShell', 'Active Directory', 'Networking'],
  },
  {
    name: 'Paul',
    email: 'paul@example.com',
    teachSkills: ['Windows', 'PowerShell', 'Active Directory', 'Networking'],
    learnSkills: ['Linux', 'Bash', 'Shell Scripting', 'System Administration'],
  },
  {
    name: 'Quinn',
    email: 'quinn@example.com',
    teachSkills: ['Data Analysis', 'Pandas', 'NumPy', 'Matplotlib'],
    learnSkills: ['Machine Learning', 'TensorFlow', 'PyTorch', 'Keras'],
  },
  {
    name: 'Rose',
    email: 'rose@example.com',
    teachSkills: ['Machine Learning', 'TensorFlow', 'PyTorch', 'Keras'],
    learnSkills: ['Data Analysis', 'Pandas', 'NumPy', 'Matplotlib'],
  },
  {
    name: 'Sam',
    email: 'sam@example.com',
    teachSkills: ['SEO', 'Content Writing', 'Digital Marketing', 'Google Ads'],
    learnSkills: ['Social Media Marketing', 'Email Marketing', 'Affiliate Marketing', 'Branding'],
  },
  {
    name: 'Tina',
    email: 'tina@example.com',
    teachSkills: ['Social Media Marketing', 'Email Marketing', 'Affiliate Marketing', 'Branding'],
    learnSkills: ['SEO', 'Content Writing', 'Digital Marketing', 'Google Ads'],
  },
];

async function populateUsers() {
  try {
    const batch = db.batch();

    for (const user of users) {
      const userRef = db.collection('users').doc(); // Auto-generate document ID

      // Hash the default password
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      batch.set(userRef, {
        ...user,
        passwordHash,
        phoneNumber: '',
        city: '',
        comments: [],
      });
    }

    await batch.commit();
    console.log('Users added successfully!');
  } catch (err) {
    console.error('Error adding users:', err);
  }
}

populateUsers();