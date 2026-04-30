const prisma = require('../lib/prisma');

/**
 * GET /api/tasks/project/:projectId
 * Get all tasks in a project
 */
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /api/tasks/project/:projectId
 * Create a new task in a project (Admin only)
 */
const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, assigneeId, dueDate, priority } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    // Validate priority
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    if (priority && !validPriorities.includes(priority.toUpperCase())) {
      return res.status(400).json({ error: 'Priority must be LOW, MEDIUM, or HIGH.' });
    }

    // If assigneeId is provided, verify they're a project member
    if (assigneeId) {
      const membership = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId: assigneeId,
          },
        },
      });

      if (!membership) {
        return res.status(400).json({ error: 'Assigned user is not a member of this project.' });
      }
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        projectId,
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority ? priority.toUpperCase() : 'MEDIUM',
        status: 'TODO',
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json({ message: 'Task created successfully.', task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * PUT /api/tasks/:taskId
 * Update a task (Admin can update everything, Member can only update status of their own tasks)
 */
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, assigneeId, dueDate, priority, status } = req.body;

    // Find the task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            members: {
              where: { userId: req.user.id },
            },
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // Check access
    const membership = task.project.members[0];
    if (!membership) {
      return res.status(403).json({ error: 'You do not have access to this task.' });
    }

    const isAdmin = membership.role === 'ADMIN';
    const isAssignee = task.assigneeId === req.user.id;

    // Members can only update their own task's status
    if (!isAdmin) {
      if (!isAssignee) {
        return res.status(403).json({ error: 'You can only update tasks assigned to you.' });
      }

      // Members can only change status
      if (title || description !== undefined || assigneeId !== undefined || dueDate !== undefined || priority) {
        return res.status(403).json({ error: 'Members can only update task status.' });
      }

      // Validate status flow: TODO → IN_PROGRESS → DONE
      if (status) {
        const validTransitions = {
          'TODO': ['IN_PROGRESS'],
          'IN_PROGRESS': ['DONE'],
          'DONE': [],
        };

        if (!validTransitions[task.status]?.includes(status)) {
          return res.status(400).json({
            error: `Cannot change status from ${task.status} to ${status}. Valid next status: ${validTransitions[task.status]?.join(', ') || 'none'}.`,
          });
        }
      }
    }

    // Validate status if provided
    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status must be TODO, IN_PROGRESS, or DONE.' });
    }

    // Validate assignee if provided
    if (assigneeId) {
      const memberCheck = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: task.projectId,
            userId: assigneeId,
          },
        },
      });

      if (!memberCheck) {
        return res.status(400).json({ error: 'Assigned user is not a member of this project.' });
      }
    }

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId || null;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority !== undefined) updateData.priority = priority.toUpperCase();
    if (status !== undefined) updateData.status = status;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });

    res.json({ message: 'Task updated successfully.', task: updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * DELETE /api/tasks/:taskId
 * Delete a task (Admin only)
 */
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find the task and check admin access
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            members: {
              where: { userId: req.user.id },
            },
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const membership = task.project.members[0];
    if (!membership) {
      return res.status(403).json({ error: 'You do not have access to this task.' });
    }

    if (membership.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only project admins can delete tasks.' });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
