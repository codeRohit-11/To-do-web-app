const { Board, Todo } = require('../models');

/**
 * Get all boards for the authenticated user
 * @route GET /api/boards
 */
exports.getBoards = async (req, res) => {
    try {
        const boards = await Board.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(boards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get a single board by ID
 * @route GET /api/boards/:id
 */
exports.getBoardById = async (req, res) => {
    try {
        const board = await Board.findOne({ _id: req.params.id, userId: req.user._id });
        if (!board) return res.status(404).json({ error: 'Board not found' });
        res.json(board);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Create a new board
 * @route POST /api/boards
 */
exports.createBoard = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });

        const board = new Board({
            title,
            description,
            userId: req.user._id
        });
        await board.save();
        res.status(201).json(board);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * Update a board
 * @route PUT /api/boards/:id
 */
exports.updateBoard = async (req, res) => {
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
};

/**
 * Delete a board and its todos
 * @route DELETE /api/boards/:id
 */
exports.deleteBoard = async (req, res) => {
    try {
        const board = await Board.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!board) return res.status(404).json({ error: 'Board not found' });

        // Delete associated todos to allow clean database
        await Todo.deleteMany({ boardId: board._id });

        res.json({ message: 'Board deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
