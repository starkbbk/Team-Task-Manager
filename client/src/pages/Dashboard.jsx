import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI, dashboardAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, ArrowUpRight, Plus, TrendingUp, CheckCircle2, Clock, 
  FolderKanban, Loader2, AlertTriangle, ListTodo, BarChart3,
  ArrowRight, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalTasks: 0, doneCount: 0, inProgressCount: 0, todoCount: 0, totalProjects: 0, overdueCount: 0 });
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchDashboardStats();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Fetch projects error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardAPI.get();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Dashboard stats error:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await projectAPI.create({ name, description });
      toast.success('Project created!');
      setShowCreate(false);
      setName(''); setDescription('');
      fetchProjects();
      fetchDashboardStats();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.doneCount / stats.totalTasks) * 100) : 0;

  const allMembers = [];
  const seen = new Set();
  projects.forEach(p => {
    (p.members || []).forEach(m => {
      if (!seen.has(m.userId)) {
        seen.add(m.userId);
        allMembers.push(m);
      }
    });
  });

  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Welcome Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
            {greeting}, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Here's what's happening with your projects today.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 active:scale-[0.97]"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* ── Stats Cards Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: projects.length, icon: <FolderKanban size={20} />, color: 'from-blue-500 to-cyan-500', iconBg: 'bg-blue-500/10 dark:bg-blue-500/20', iconColor: 'text-blue-500', click: '/projects' },
          { label: 'Total Tasks', value: stats.totalTasks, icon: <ListTodo size={20} />, color: 'from-violet-500 to-purple-500', iconBg: 'bg-violet-500/10 dark:bg-violet-500/20', iconColor: 'text-violet-500', click: '/tasks' },
          { label: 'Completed', value: stats.doneCount, icon: <CheckCircle2 size={20} />, color: 'from-emerald-500 to-teal-500', iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20', iconColor: 'text-emerald-500', click: '/tasks' },
          { label: 'Overdue', value: stats.overdueCount || 0, icon: <AlertTriangle size={20} />, color: 'from-red-500 to-rose-500', iconBg: 'bg-red-500/10 dark:bg-red-500/20', iconColor: 'text-red-500', click: '/tasks' },
        ].map((stat) => (
          <div
            key={stat.label}
            onClick={() => nav(stat.click)}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group border border-slate-100 dark:border-slate-700/50 relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.color}`} />
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor}`}>
                {stat.icon}
              </div>
              <ArrowUpRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-amber-500 transition-colors" />
            </div>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white">{stat.value}</p>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Progress + Task Distribution */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Overview Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Progress Overview</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Task completion across all projects</p>
                </div>
                <button onClick={() => nav('/analytics')} className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors">
                  Analytics <ArrowRight size={12} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Circular Progress */}
                <div className="relative w-36 h-36 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" className="stroke-slate-100 dark:stroke-slate-700" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="url(#dashGrad)"
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${completionRate * 2.51} ${251 - completionRate * 2.51}`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{completionRate}%</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Done</span>
                  </div>
                </div>

                {/* Distribution Bars */}
                <div className="flex-1 w-full space-y-4">
                  {[
                    { label: 'To Do', value: stats.todoCount, color: 'bg-slate-400 dark:bg-slate-500', total: stats.totalTasks || 1 },
                    { label: 'In Progress', value: stats.inProgressCount, color: 'bg-blue-500', total: stats.totalTasks || 1 },
                    { label: 'Completed', value: stats.doneCount, color: 'bg-emerald-500', total: stats.totalTasks || 1 },
                  ].map(bar => (
                    <div key={bar.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${bar.color}`} />
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{bar.label}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{bar.value}</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${bar.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${Math.max((bar.value / bar.total) * 100, bar.value > 0 ? 5 : 0)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Stats Strip */}
            <div className="grid grid-cols-3 border-t border-slate-100 dark:border-slate-700">
              {[
                { label: 'Pending', value: stats.todoCount + stats.inProgressCount, icon: <Clock size={14} />, color: 'text-amber-500' },
                { label: 'Overdue', value: stats.overdueCount || 0, icon: <AlertTriangle size={14} />, color: 'text-red-500' },
                { label: 'Done', value: stats.doneCount, icon: <CheckCircle2 size={14} />, color: 'text-emerald-500' },
              ].map((s, i) => (
                <div key={s.label} className={`px-6 py-4 text-center ${i > 0 ? 'border-l border-slate-100 dark:border-slate-700' : ''}`}>
                  <div className={`flex items-center justify-center gap-1.5 ${s.color} mb-1`}>
                    {s.icon}
                    <span className="text-lg font-extrabold">{s.value}</span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Projects</h2>
              <button onClick={() => nav('/projects')} className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors">
                View All <ArrowRight size={12} />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-amber-500" size={24} />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FolderKanban size={28} className="text-amber-500" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-1">No projects yet</h3>
                <p className="text-sm text-slate-400 mb-4">Create your first project to get started</p>
                <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors">
                  <Plus size={14} /> Create Project
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project, index) => {
                  const gradients = [
                    'from-amber-400 to-orange-500', 'from-blue-400 to-indigo-500',
                    'from-emerald-400 to-teal-500', 'from-pink-400 to-rose-500',
                    'from-violet-400 to-purple-500'
                  ];
                  const taskCount = project._count?.tasks || 0;
                  const memberCount = project.members?.length || 0;

                  return (
                    <div
                      key={project.id}
                      onClick={() => nav(`/projects/${project.id}`)}
                      className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer group transition-all"
                    >
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradients[index % 5]} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">{project.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {taskCount} task{taskCount !== 1 ? 's' : ''} · {memberCount} member{memberCount !== 1 ? 's' : ''}
                          {project.userRole === 'ADMIN' && <span className="ml-1.5 text-amber-500 font-semibold">• Admin</span>}
                        </p>
                      </div>
                      <ArrowUpRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-amber-500 transition-colors flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Team + Quick Actions */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-sm" />
            <div className="absolute bottom-2 left-1/2 w-16 h-16 bg-white/5 rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={18} />
                <span className="text-sm font-bold">Quick Stats</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-2xl font-extrabold">{projects.length}</p>
                  <p className="text-[10px] text-white/70 font-semibold uppercase">Projects</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-2xl font-extrabold">{allMembers.length}</p>
                  <p className="text-[10px] text-white/70 font-semibold uppercase">Members</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-2xl font-extrabold">{stats.totalTasks}</p>
                  <p className="text-[10px] text-white/70 font-semibold uppercase">Tasks</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-2xl font-extrabold">{completionRate}%</p>
                  <p className="text-[10px] text-white/70 font-semibold uppercase">Complete</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Team Members</h2>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg">{allMembers.length}</span>
            </div>

            {allMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users size={28} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No team members yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {allMembers.slice(0, 6).map((m, i) => {
                  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-pink-500', 'bg-amber-500', 'bg-cyan-500'];
                  return (
                    <div key={i} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <div className={`w-9 h-9 rounded-full ${colors[i % 6]} flex items-center justify-center shadow-sm flex-shrink-0`}>
                        <span className="text-white text-xs font-bold">{m.user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{m.user.name}</p>
                        <p className="text-[10px] text-slate-400">{m.user.email}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-md ${
                        m.role === 'ADMIN' 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}>
                        {m.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Activity Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Activity</h2>
            <div className="space-y-3">
              {[
                { icon: <FolderKanban size={14} />, text: `${projects.length} projects created`, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { icon: <ListTodo size={14} />, text: `${stats.totalTasks} tasks total`, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                { icon: <CheckCircle2 size={14} />, text: `${stats.doneCount} tasks completed`, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { icon: <Users size={14} />, text: `${allMembers.length} team members`, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center ${item.color} flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <span className="text-slate-600 dark:text-slate-300 text-xs font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Create Project Modal ── */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Project Name</label>
            <input
              id="project-name-input"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-field"
              placeholder="My Awesome Project"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Description (optional)</label>
            <textarea
              id="project-desc-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="What's this project about?"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={creating} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.97] disabled:opacity-50">
              {creating ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Create</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
