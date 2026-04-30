const prisma = require('../lib/prisma');

/**
 * Middleware to check if the user is a member of the project and attach their role
 */
const projectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required.' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          where: { userId: req.user.id },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    if (project.members.length === 0) {
      return res.status(403).json({ error: 'You do not have access to this project.' });
    }

    req.project = project;
    req.userRole = project.members[0].role;
    
    next();
  } catch (error) {
    console.error('Project access check error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Middleware to ensure the user is an Admin of the project
 * Must be used after projectAccess middleware
 */
const requireAdmin = (req, res, next) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Only project admins can perform this action.' });
  }
  next();
};

module.exports = { projectAccess, requireAdmin };
