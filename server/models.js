const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// --- User Model ---
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model('User', UserSchema);

// --- Board Model ---
const BoardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Board = mongoose.model('Board', BoardSchema);

// --- Todo Model ---
const TodoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = { User, Board, Todo };
