const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');
const todoRoutes = require('./routes/todoRoutes');

// Wiring routes
app.use('/api/auth', authRoutes); // /api/auth/login, /register
app.use('/api/boards', boardRoutes); // /api/boards CRUD
app.use('/api/todos', todoRoutes); // /api/todos CRUD

// Handle the nested route GET /boards/:id/todos
// We can attach it to boards router or define it here explicitly if controllers are flexible 
// Ideally it should be inside boardRoutes. 
// Let's add it to boardRoutes now.

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
