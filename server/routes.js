const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Board, Todo } = require('./models');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// --- Middleware ---
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// --- Auth Routes ---
router.post('/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Board Routes ---
router.get('/boards', authMiddleware, async (req, res) => {
    try {
        const boards = await Board.find({ userId: req.user._id });
        res.json(boards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/boards/:id', authMiddleware, async (req, res) => {
    try {
        const board = await Board.findOne({ _id: req.params.id, userId: req.user._id });
        if (!board) return res.status(404).json({ error: 'Board not found' });
        res.json(board);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/boards', authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        const board = new Board({ title, description, userId: req.user._id });
        await board.save();
        res.status(201).json(board);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/boards/:id', authMiddleware, async (req, res) => {
    try {
        const board = await Board.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!board) return res.status(404).json({ error: 'Board not found' });
        res.json(board);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/boards/:id', authMiddleware, async (req, res) => {
    try {
        const board = await Board.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!board) return res.status(404).json({ error: 'Board not found' });
        // Delete associated todos
        await Todo.deleteMany({ boardId: board._id });
        res.json({ message: 'Board deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Todo Routes ---
router.get('/boards/:id/todos', authMiddleware, async (req, res) => {
    try {
        const todos = await Todo.find({ boardId: req.params.id });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/todos', authMiddleware, async (req, res) => {
    try {
        const { title, description, boardId } = req.body;
        // Verify board ownership
        const board = await Board.findOne({ _id: boardId, userId: req.user._id });
        if (!board) return res.status(404).json({ error: 'Board not found' });

        const todo = new Todo({ title, description, boardId });
        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/todos/:id', authMiddleware, async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/todos/:id', authMiddleware, async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
