<h1>MERN Authentication App</h1>

<p>
A full-stack <strong>MERN</strong> (MongoDB, Express, React, Node.js) application with 
user authentication using <strong>JWT</strong>.  
Supports register, login, protected routes, logout, and secure password hashing with <code>bcrypt</code>.
</p>

<h2>🚀 Features</h2>
<ul>
  <li>🔐 User registration & login</li>
  <li>🔑 JWT authentication</li>
  <li>👤 User profile (protected)</li>
  <li>🚫 Access control for private routes</li>
  <li>🧂 Password hashing with bcrypt</li>
  <li>⚡ Express API + MongoDB Atlas</li>
  <li>🎨 React frontend with routing</li>
</ul>

<h2>🛠️ Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong> React, React Router, Axios</li>
  <li><strong>Backend:</strong> Node.js, Express.js</li>
  <li><strong>Database:</strong> MongoDB / MongoDB Atlas</li>
  <li><strong>Auth:</strong> JWT, bcrypt</li>
</ul>

<h2>📂 Project Structure</h2>
<pre>
mern-auth-app/
│
├── backend/            # Express + Node.js API
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── controllers/
│
├── frontend/           # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   └── package.json
│
└── README.md
</pre>

<h2>⚙️ Installation</h2>
<pre>
# Clone the repo
git clone https://github.com/your-username/mern-auth-app.git
cd mern-auth-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
</pre>

<h2>🔑 Environment Variables</h2>
<p>Create a <code>.env</code> file inside <code>backend/</code>:</p>
<pre>
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
</pre>

<h2>▶️ Running the App</h2>
<pre>
# Backend (Express API)
cd backend
npm run dev   # Runs on http://localhost:5000

# Frontend (React)
cd frontend
npm start     # Runs on http://localhost:3000
</pre>

<h2>🛡️ API Routes</h2>
<table>
  <tr>
    <th>Method</th><th>Endpoint</th><th>Description</th><th>Auth</th>
  </tr>
  <tr>
    <td>POST</td><td>/api/auth/register</td><td>Register new user</td><td>No</td>
  </tr>
  <tr>
    <td>POST</td><td>/api/auth/login</td><td>Login user</td><td>No</td>
  </tr>
  <tr>
    <td>GET</td><td>/api/auth/profile</td><td>Get logged-in user</td><td>Yes (JWT)</td>
  </tr>
  <tr>
    <td>POST</td><td>/api/auth/logout</td><td>Logout user</td><td>Yes (JWT)</td>
  </tr>
</table>

<h2>📦 Build & Deployment</h2>
<pre>
# Build frontend for production
cd frontend
npm run build

# Serve frontend with backend (Express)
app.use(express.static("frontend/build"));
</pre>

<h2>🤝 Contributing</h2>
<p>Pull requests are welcome! Please open an issue first for discussion.</p>
