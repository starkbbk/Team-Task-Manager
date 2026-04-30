const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { projectAccess, requireAdmin } = require('../middleware/roleCheck');
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');

// All routes require authentication
router.use(authenticate);

// Project CRUD
router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', projectAccess, getProject);
router.put('/:id', projectAccess, requireAdmin, updateProject);
router.delete('/:id', projectAccess, requireAdmin, deleteProject);

// Member management (Admin only)
router.post('/:id/members', projectAccess, requireAdmin, addMember);
router.delete('/:id/members/:userId', projectAccess, requireAdmin, removeMember);

module.exports = router;
