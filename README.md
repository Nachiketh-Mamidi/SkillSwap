# SkillSwap

SkillSwap is a full-stack web application that allows users to barter/exchange skills. Users can sign up, list the skills they want to teach and learn, and get matched with others who have complementary skill sets.

---

## 🏗 Project Structure

```
SkillSwap/
├── backend/        # Node.js Express API server (Firestore + JWT auth)
└── frontend/       # React + Bootstrap frontend (with tag input UI)
```

---

## 🚀 Backend Setup (Express + Firestore)

### 🔧 Prerequisites

- Node.js ≥ 16
- Firebase project with Firestore enabled
- Service account key (JSON)

### 🔌 Setup

```bash
cd backend
```

#### 1. Create `.env`

```env
PORT=8080
JWT_SECRET=your_secret_here
```

#### 2. Place Firebase credentials

Save your Firebase Admin SDK key as:

```bash
backend/serviceAccountKey.json
```

#### 3. Install dependencies

```bash
npm install
```

#### 4. Start the server

```bash
node src/index.js
```

The backend will run on: `http://localhost:8080`

---

## 💻 Frontend Setup (React + Bootstrap)

### 🔧 Prerequisites

- Node.js ≥ 16

### 🔌 Setup

```bash
cd frontend
```

#### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

> Tip: You may need `--legacy-peer-deps` if you use `react-tagsinput` with React 18.

#### 2. Set API base URL

Make sure `API_BASE` in `src/pages/Login.js` and `src/pages/Home.js` is:

```js
const API_BASE = "http://localhost:8080";
```

#### 3. Start the frontend

```bash
npm start
```

The frontend will run on: `http://localhost:3000`

---

## ✅ Features

- JWT-based login/signup
- Cloud Firestore as the database
- Skills input using tags
- Skill-based matching logic
- Rate limiting on backend
- Styled using React Bootstrap

---

## 📦 Deployment

- Frontend: Deploy via Firebase Hosting, Vercel, or Netlify
- Backend: Deploy via Google Cloud Run or App Engine

Let us know if you need help containerizing or deploying the app!

---

## 👤 Author

**Nachiketh Mamidi**

- [GitHub](https://github.com/Nachiketh-Mamidi)
- Email: nachiketh1110@gmail.com
