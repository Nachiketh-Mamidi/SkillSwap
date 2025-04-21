# SkillSwap Backend

This is the backend service for the SkillSwap web application, built with Express.js and Firebase Firestore. It provides APIs for user authentication, profile management, skill matching, and chat functionality.

---

## 🔧 Setup

### 1. Install dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

### 2. Create `.env`

Create a `.env` file in the `backend` directory with the following content:

```env
PORT=8080
JWT_SECRET=your_jwt_secret_here
```

- `PORT`: The port on which the backend server will run.
- `JWT_SECRET`: A secret key used for signing JSON Web Tokens (JWTs).

### 3. Add Firebase Admin SDK key

Download your Firebase Admin SDK key from the Firebase console and save it as:

```
backend/serviceAccountKey.json
```

### 4. Start the server

Run the following command to start the backend server:

```bash
node src/index.js
```

The backend will run on: `http://localhost:8080`

---

## 🔌 API Endpoints

The backend provides the following API endpoints:

### **Authentication**

#### `POST /auth/signup`

- **Description**: Allows users to create a new account.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!",
    "name": "John Doe"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here"
  }
  ```
- **Details**: 
  - Validates the email format and password strength.
  - Hashes the password before storing it in the database.
  - Returns a JWT token upon successful signup.

#### `POST /auth/login`

- **Description**: Authenticates users by verifying their email and password.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here"
  }
  ```
- **Details**:
  - Verifies the provided email and password.
  - Returns a JWT token for secure access to protected routes.

---

### **User Profile**

#### `GET /user/me`

- **Description**: Retrieves the profile of the currently logged-in user.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer jwt_token_here"
  }
  ```
- **Response**:
  ```json
  {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "phoneNumber": "1234567890",
    "city": "New York",
    "teachSkills": ["JavaScript", "React"],
    "learnSkills": ["Python", "Django"],
    "comments": [
      {
        "id": "comment_id",
        "text": "This is a comment",
        "timestamp": "2023-01-01T00:00:00Z"
      }
    ]
  }
  ```
- **Details**:
  - Returns the user's profile details, including their skills and comments.

#### `PUT /user/me`

- **Description**: Updates the logged-in user's profile details.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer jwt_token_here"
  }
  ```
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "phoneNumber": "1234567890",
    "city": "New York",
    "teachSkills": ["JavaScript", "React"],
    "learnSkills": ["Python", "Django"]
  }
  ```
- **Response**:
  ```json
  {
    "message": "Profile updated successfully"
  }
  ```
- **Details**:
  - Updates the user's name, phone number, city, and skills.

#### `POST /user/me/comments`

- **Description**: Allows users to add comments or notes to their profile.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer jwt_token_here"
  }
  ```
- **Request Body**:
  ```json
  {
    "text": "This is a comment"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Comment added successfully",
    "comment": {
      "id": "comment_id",
      "text": "This is a comment",
      "timestamp": "2023-01-01T00:00:00Z"
    }
  }
  ```
- **Details**:
  - Adds a new comment to the user's profile.

---

### **Skill Matching**

#### `GET /match`

- **Description**: Finds and returns a list of users whose teach/learn skills match the logged-in user's learn/teach skills.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer jwt_token_here"
  }
  ```
- **Response**:
  ```json
  [
    {
      "id": "user_id",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "teachSkills": ["Python", "Django"],
      "learnSkills": ["JavaScript", "React"],
      "matchingTeachSkills": ["Python"],
      "matchingLearnSkills": ["JavaScript"]
    }
  ]
  ```
- **Details**:
  - Matches users based on complementary teach and learn skills.

---

### **Chat**

#### `GET /chat`

- **Description**: Retrieves all chat conversations for the logged-in user.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer jwt_token_here"
  }
  ```
- **Response**:
  ```json
  [
    {
      "id": "chat_id",
      "participants": [
        { "id": "user_id_1", "name": "John Doe" },
        { "id": "user_id_2", "name": "Jane Smith" }
      ],
      "messages": [
        {
          "senderId": "user_id_1",
          "message": "Hello!",
          "timestamp": "2023-01-01T00:00:00Z"
        }
      ]
    }
  ]
  ```
- **Details**:
  - Returns a list of all chats the user is a participant in.

#### `POST /chat`

- **Description**: Creates or fetches a chat between the logged-in user and another user.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer jwt_token_here"
  }
  ```
- **Request Body**:
  ```json
  {
    "recipientId": "user_id_2"
  }
  ```
- **Response**:
  ```json
  {
    "chatId": "chat_id"
  }
  ```
- **Details**:
  - Creates a new chat if one does not already exist between the two users.

#### `GET /chat/:chatId`

- **Description**: Retrieves the messages and participants of a specific chat.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer jwt_token_here"
  }
  ```
- **Response**:
  ```json
  {
    "id": "chat_id",
    "participants": [
      { "id": "user_id_1", "name": "John Doe" },
      { "id": "user_id_2", "name": "Jane Smith" }
    ],
    "messages": [
      {
        "senderId": "user_id_1",
        "message": "Hello!",
        "timestamp": "2023-01-01T00:00:00Z"
      }
    ]
  }
  ```
- **Details**:
  - Returns the chat details, including participants and messages.

#### `POST /chat/:chatId/messages`

- **Description**: Adds a new message to a specific chat.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer jwt_token_here"
  }
  ```
- **Request Body**:
  ```json
  {
    "message": "Hello!"
  }
  ```
- **Response**:
  ```json
  {
    "senderId": "user_id_1",
    "message": "Hello!",
    "timestamp": "2023-01-01T00:00:00Z"
  }
  ```
- **Details**:
  - Adds a new message to the specified chat.

---

## 📦 Tech Stack

- **Node.js + Express.js**: Backend framework for building APIs.
- **Firebase Firestore**: NoSQL database for storing user profiles, skills, and chat data.
- **JWT Authentication**: Secure user authentication using JSON Web Tokens.
- **Express Rate Limiter**: Middleware to prevent abuse by limiting the number of requests.

---

Make sure to run this alongside the frontend app to use the full SkillSwap experience!