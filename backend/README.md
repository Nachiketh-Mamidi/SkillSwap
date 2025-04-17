# SkillSwap Backend

This is the backend service for the SkillSwap web application, built with Express.js and Firebase Firestore.

## 🔧 Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

```env
PORT=8080
JWT_SECRET=your_jwt_secret_here
```

### 3. Add Firebase Admin SDK key

Save your downloaded service account key from Firebase as:

```
backend/serviceAccountKey.json
```

### 4. Start the server

```bash
node src/index.js
```

## 🔌 API Endpoints

- `POST /auth/signup` – Create a new user
- `POST /auth/login` – Authenticate user
- `GET /user/me` – Get logged-in user's profile
- `PUT /user/me` – Update teach/learn skills
- `GET /match` – Get matched users based on skills

## 📦 Tech Stack

- Node.js + Express.js
- Firebase Firestore
- JWT Authentication
- Express Rate Limiter

---

Make sure to run this alongside the frontend app to use the full SkillSwap experience!
