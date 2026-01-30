const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');

// All todo routes need authentication
router.use(authMiddleware);

router.post('/', todoController.createTodo);
// Note: In controller we used /board/:id/todos, but here we registered standard todo routes
// We need to support fetching todos for a board also.
// Let's keep the nested route structure consistent with old routes or use query params.
// For now, we'll map the exact old routes in index.js or handle nesting here.

// The old route was GET /boards/:id/todos.
// The new structure suggests:
// POST /todos -> create
// PUT /todos/:id -> update
// DELETE /todos/:id -> delete
// GET /boards/:id/todos -> list (This belongs better in Board routes or a specific query on Todos)

// Let's support the CRUD on Todos here:
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
