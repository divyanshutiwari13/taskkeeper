# taskkeeper
React-Node Full Stack Project 
# 📌 MERN ToDo Dashboard

A simple **MERN Stack ToDo Application** with user authentication (Signup/Login) and a dashboard to manage tasks along with **Date & Time** for each todo.

## 🚀 Features

- **User Authentication** (JWT based)
- **Add, Edit, Delete ToDos**
- **Displays Date & Time** for each task
- **Protected Routes**
- **Responsive UI with Vite + React**
- **MongoDB for persistent storage**


## 🛠 Tech Stack

- **Frontend:** React (Vite), Axios, CSS
- **Backend:** Node.js, Express.js, MongoDB, JWT
- **Database:** MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT)

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
git clone <repo_url>
cd mern-todo
### 2️⃣ Backend Setup

cd backend
npm install


**Create `.env` file** in the `backend` folder:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

Run Backend:

npm run dev

Backend will run on [**http://localhost:5000**]

### 3️⃣ Frontend Setup

cd frontend
npm install
npm run dev

Frontend will run on [**http://localhost:5173**](
## 📌 Workflow of Project

1. **User Registration/Login** → Generates JWT Token
2. **Token stored** in LocalStorage
3. **User accesses dashboard** (Protected Route)
4. **Add/Edit/Delete Todos** with Date & Time
5. **Data saved** in MongoDB
## 📸 Screenshots

http://localhost:5173/auth
<img width="1919" height="869" alt="todo-login" src="https://github.com/user-attachments/assets/fc28757c-06dc-4d90-b808-0514a5297beb" />
<img width="1918" height="867" alt="todo" src="https://github.com/user-attachments/assets/5b4eaf82-ca0c-4239-83c1-a9bb2cccc20c" />

## 📜 License

This project is **open-source**. Feel free to use and modify.
