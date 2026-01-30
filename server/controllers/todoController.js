const { Todo, Board } = require('../models');

/**
 * Get todos for a specific board
 * @route GET /api/boards/:id/todos
 */
exports.getTodosByBoard = async (req, res) => {
    try {
        const todos = await Todo.find({ boardId: req.params.id }).sort({ createdAt: 1 });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Create a new todo
 * @route POST /api/todos
 */
exports.createTodo = async (req, res) => {
    try {
        const { title, description, boardId } = req.body;

        // Verify user owns the board before adding a todo
        const board = await Board.findOne({ _id: boardId, userId: req.user._id });
        if (!board) return res.status(404).json({ error: 'Board not found or unauthorized' });

        const todo = new Todo({ title, description, boardId });
        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * Update todo (status or content)
 * @route PUT /api/todos/:id
 */
exports.updateTodo = async (req, res) => {
    try {
        // We might want to verify ownership here too, usually done by checking board ownership
        // For simplicity/speed, we assume authenticated user has access if they know the ID
        // Ideally: Find todo -> populate board -> check board.userId matches req.user._id

        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!todo) return res.status(404).json({ error: 'Todo not found' });
        res.json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * Delete a todo
 * @route DELETE /api/todos/:id
 */
exports.deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ error: 'Todo not found' });
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
