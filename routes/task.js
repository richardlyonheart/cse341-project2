const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/task');
const { validateTask } = require('../middleware/validation');

const { isAuthenticated } = require('../middleware/auth');

// Define routes for tasks
router.get('/', isAuthenticated, tasksController.getTasks);
router.get('/:id', isAuthenticated, tasksController.getTaskById);
router.post('/', isAuthenticated, validateTask, tasksController.createTask);
router.put('/:id', isAuthenticated, validateTask, tasksController.updateTask);
router.delete('/:id', isAuthenticated, tasksController.deleteTask);

module.exports = router;