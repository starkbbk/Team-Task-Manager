const prisma = require('../lib/prisma');

/**
 * GET /api/projects
 * Get all projects the current user belongs to
 */
const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: { userId: req.user.id },
        },
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Attach user's role in each project
    const projectsWithRole = projects.map((project) => {
      const membership = project.members.find((m) => m.userId === req.user.id);
      return {
        ...project,
        userRole: membership?.role || null,
      };
    });

    res.json({ projects: projectsWithRole });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /api/projects
 * Create a new project (creator becomes Admin)
 */
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Project name is required.' });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({ error: 'Project name must be under 100 characters.' });
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        ownerId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: 'ADMIN',
          },
        },
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    res.status(201).json({
      message: 'Project created successfully.',
      project: { ...project, userRole: 'ADMIN' },
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * GET /api/projects/:id
 * Get a single project with members and tasks
 */
const getProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { joinedAt: 'asc' },
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.json({ project: { ...project, userRole: req.userRole } });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * PUT /api/projects/:id
 * Update project name/description (Admin only)
 */
const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Project name is required.' });
    }

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    res.json({ message: 'Project updated successfully.', project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * DELETE /api/projects/:id
 * Delete a project and all related data (Admin only)
 */
const deleteProject = async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /api/projects/:id/members
 * Add a member to the project by email (Admin only)
 */
const addMember = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'No user found with this email. They must sign up first.' });
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: req.params.id,
          userId: user.id,
        },
      },
    });

    if (existingMember) {
      return res.status(400).json({ error: 'This user is already a member of this project.' });
    }

    // Add member
    const membership = await prisma.projectMember.create({
      data: {
        projectId: req.params.id,
        userId: user.id,
        role: 'MEMBER',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      message: `${user.name} has been added to the project.`,
      member: membership,
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * DELETE /api/projects/:id/members/:userId
 * Remove a member from the project (Admin only)
 */
const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const projectId = req.params.id;

    // Can't remove yourself if you're the owner
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'You cannot remove yourself from a project you own.' });
    }

    // Check membership exists
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!membership) {
      return res.status(404).json({ error: 'Member not found in this project.' });
    }

    // Remove member
    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    // Also unassign their tasks in this project
    await prisma.task.updateMany({
      where: {
        projectId,
        assigneeId: userId,
      },
      data: {
        assigneeId: null,
      },
    });

    res.json({ message: 'Member removed successfully.' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
