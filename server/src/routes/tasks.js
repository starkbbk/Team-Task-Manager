const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { projectAccess, requireAdmin } = require('../middleware/roleCheck');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// All routes require authentication
router.use(authenticate);

// Task routes scoped to a project
router.get('/project/:projectId', projectAccess, getTasks);
router.post('/project/:projectId', projectAccess, requireAdmin, createTask);

// Task-specific routes (access checked inside controller)
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

module.exports = router;
