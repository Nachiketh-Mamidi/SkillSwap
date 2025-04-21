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
JWT_SECRET=kES0nGrhxxadT/xYzuXmU94IP1mPcJB7+/o78eOfm2w=
(for testing purposes)
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

### 🔌 Backend API Endpoints

The backend provides the following API endpoints:

- **`POST /auth/signup`**: Allows users to create a new account by providing their email, password, and name. The password is securely hashed before being stored.
- **`POST /auth/login`**: Authenticates users by verifying their email and password. Returns a JWT token for secure access to protected routes.
- **`GET /user/me`**: Retrieves the profile of the currently logged-in user, including their name, email, phone number, city, skills they can teach, and skills they want to learn.
- **`PUT /user/me`**: Updates the logged-in user's profile details, such as name, phone number, city, and their teach/learn skills.
- **`POST /user/me/comments`**: Allows users to add comments or notes to their profile.
- **`GET /match`**: Finds and returns a list of users whose teach/learn skills match the logged-in user's learn/teach skills.
- **`GET /chat`**: Retrieves all chat conversations for the logged-in user.
- **`POST /chat`**: Creates or fetches a chat between the logged-in user and another user.
- **`GET /chat/:chatId`**: Retrieves the messages and participants of a specific chat.
- **`POST /chat/:chatId/messages`**: Adds a new message to a specific chat.

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

### 🔌 Frontend Pages

The frontend includes the following pages:

- **`Login.js`**: This page provides login and signup functionality. Users can log in with their credentials or create a new account by providing their name, email, and password. Upon successful authentication, users are redirected to the home page.

- **`Home.js`**: The home page serves as a personalized dashboard for users. It displays their teach and learn skills, allows them to update these skills, and provides a "Find Matches" button to discover other users with complementary skills. Users can also connect with matches to start a chat.

- **`Profile.js`**: The profile page allows users to view and update their personal details, such as name, phone number, and city. Users can also add notes or comments to their profile, which are displayed in a list format.

- **`Chat.js`**: This page enables users to view and participate in skill-based chats. Users can see their chat history, send messages, and view the skills they can teach or learn from the other participant in the chat.

---

## ✅ Features

- JWT-based login/signup for secure authentication.
- Cloud Firestore as the database for storing user profiles, skills, and chat data.
- Skills input using tags for an intuitive user experience.
- Skill-based matching logic to connect users with complementary skill sets.
- Rate limiting on the backend to prevent abuse.
- Styled using React Bootstrap for a responsive and modern UI.

---

## 📦 Deployment

- **Frontend**: Deploy via Firebase Hosting, Vercel, or Netlify.
- **Backend**: Deploy via Google Cloud Run or App Engine.

Let us know if you need help containerizing or deploying the app!

---

## 👤 Author

**Nachiketh Mamidi**

- [GitHub](https://github.com/Nachiketh-Mamidi)
- Email: nachiketh1110@gmail.com
