const prisma = require('../lib/prisma');

/**
 * GET /api/dashboard
 * Get dashboard stats for the logged-in user
 */
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all projects user belongs to
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      select: { id: true, name: true },
    });

    const projectIds = projects.map((p) => p.id);

    // Get all tasks assigned to user
    const tasks = await prisma.task.findMany({
      where: {
        assigneeId: userId,
        projectId: { in: projectIds },
      },
      include: {
        project: {
          select: { id: true, name: true },
        },
      },
    });

    // Count tasks by status
    const todoCount = tasks.filter((t) => t.status === 'TODO').length;
    const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const doneCount = tasks.filter((t) => t.status === 'DONE').length;

    // Get overdue tasks (due date passed, status is not DONE)
    const now = new Date();
    const overdueTasks = tasks
      .filter((t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'DONE')
      .map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        priority: t.priority,
        status: t.status,
        project: t.project,
      }));

    res.json({
      stats: {
        totalProjects: projects.length,
        totalTasks: tasks.length,
        todoCount,
        inProgressCount,
        doneCount,
        overdueCount: overdueTasks.length,
      },
      overdueTasks,
      recentProjects: projects.slice(0, 5),
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { getDashboard };
