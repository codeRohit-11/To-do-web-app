const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const authMiddleware = require('../middleware/authMiddleware');

// All board routes need authentication
router.use(authMiddleware);

router.get('/', boardController.getBoards);
router.post('/', boardController.createBoard);
const todoController = require('../controllers/todoController');

// All board routes need authentication
router.use(authMiddleware);

router.get('/', boardController.getBoards);
router.post('/', boardController.createBoard);
router.get('/:id', boardController.getBoardById);
router.put('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);

// Nested route to get todos for a board
router.get('/:id/todos', todoController.getTodosByBoard);


module.exports = router;
