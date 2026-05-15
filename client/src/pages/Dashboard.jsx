import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI, dashboardAPI } from '../api';
import { 
  Users, 
  ArrowUpRight, 
  Plus, 
  PlayCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  FolderKanban,
  Sparkles,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

const Dashboard = () => {
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

  const activeMemberCount = new Set(
    projects.flatMap(p => (p.members || []).map(m => m.userId))
  ).size;

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.doneCount / stats.totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Welcome + Quick Stats Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Hero Banner */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl min-h-[220px]"
          style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 40%, #b45309 100%)' }}>
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-sm" />
          <div className="absolute bottom-4 left-1/2 w-24 h-24 bg-white/5 rounded-full" />
          <div className="relative z-10 p-8 flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white/90 text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                <Sparkles size={10} /> Dashboard
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Manage Your Team<br />Tasks Effectively!
              </h1>
              <p className="text-white/60 text-sm mt-2 max-w-xs">
                Track projects, tasks, and team progress in one seamless dashboard.
              </p>
            </div>
            <div className="flex gap-6 mt-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <Users className="text-white" size={16} />
                </div>
                <div>
                  <p className="text-white font-extrabold text-lg leading-none">{activeMemberCount || 0}</p>
                  <p className="text-white/50 text-[10px] font-semibold">Members</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="text-white" size={16} />
                </div>
                <div>
                  <p className="text-white font-extrabold text-lg leading-none">{stats.doneCount || 0}</p>
                  <p className="text-white/50 text-[10px] font-semibold">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          {[
            { label: 'Total Projects', value: projects.length, icon: <FolderKanban size={18} />, gradient: 'from-blue-500 to-cyan-400', click: '/projects' },
            { label: 'In Progress', value: stats.inProgressCount + stats.todoCount, icon: <Clock size={18} />, gradient: 'from-amber-500 to-orange-400', click: '/tasks' },
            { label: 'Completed', value: stats.doneCount, icon: <CheckCircle2 size={18} />, gradient: 'from-emerald-500 to-teal-400', click: '/tasks' },
            { label: 'Completion', value: `${completionRate}%`, icon: <TrendingUp size={18} />, gradient: 'from-violet-500 to-purple-400', click: '/analytics' },
          ].map((stat) => (
            <div
              key={stat.label}
              onClick={() => nav(stat.click)}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-slate-100 dark:border-slate-700/50 relative overflow-hidden"
            >
              {/* Accent gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-80`} />
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-extrabold text-slate-800 dark:text-white">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Create Project CTA ── */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-yellow-500/10 dark:from-amber-500/5 dark:via-orange-500/5 dark:to-yellow-500/5 rounded-2xl p-5 flex items-center justify-between border border-amber-500/10 dark:border-amber-500/15">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
            <Plus size={22} />
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-100">Start a new project</p>
            <p className="text-xs text-slate-400">Create and manage your team's tasks efficiently</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 active:scale-[0.97] flex items-center gap-2"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Projects */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Projects</h2>
            <button onClick={() => nav('/projects')} className="text-[10px] font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-wider">
              See All →
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-amber-500" size={24} />
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm text-center border border-slate-100 dark:border-slate-700/50">
                <FolderKanban size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No projects yet</p>
                <button onClick={() => setShowCreate(true)} className="mt-3 text-xs font-bold text-amber-500 hover:text-amber-400">
                  + Create your first project
                </button>
              </div>
            ) : (
              projects.slice(0, 4).map((project, index) => {
                const colors = ['from-amber-400 to-orange-500', 'from-pink-500 to-rose-500', 'from-emerald-400 to-teal-500', 'from-blue-500 to-indigo-500'];
                return (
                  <div
                    key={project.id}
                    onClick={() => nav(`/projects/${project.id}`)}
                    className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group border border-slate-100 dark:border-slate-700/50 hover:border-amber-500/20"
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors[index % 4]} flex items-center justify-center font-bold text-white text-sm shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors truncate">{project.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{project._count?.tasks || 0} Tasks · {project.members?.length || 0} Members</p>
                    </div>
                    <ArrowUpRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-amber-500 transition-colors" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Task Stats */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Task Overview</h2>
            <button onClick={() => nav('/tasks')} className="text-[10px] font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-wider">
              All Tasks →
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Task Distribution</p>
                <p className="text-[10px] text-slate-400 font-medium">Tasks by status</p>
              </div>
            </div>

            {/* Task Distribution Bars */}
            <div className="space-y-4 mb-6">
              {[
                { label: 'To Do', value: stats.todoCount, color: 'bg-blue-500', max: stats.totalTasks || 1 },
                { label: 'In Progress', value: stats.inProgressCount, color: 'bg-amber-500', max: stats.totalTasks || 1 },
                { label: 'Done', value: stats.doneCount, color: 'bg-emerald-500', max: stats.totalTasks || 1 },
              ].map(bar => (
                <div key={bar.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{bar.label}</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{bar.value}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bar.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${(bar.value / bar.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => nav('/tasks')}
                className="bg-gradient-to-br from-amber-500 to-orange-500 p-4 rounded-xl cursor-pointer hover:shadow-lg hover:shadow-amber-500/20 transition-all relative overflow-hidden"
              >
                <p className="text-white font-extrabold text-xl leading-none">{stats.todoCount + stats.inProgressCount}</p>
                <p className="text-white/60 text-[9px] font-bold uppercase mt-1 tracking-wider">Pending</p>
                <div className="absolute right-2 bottom-2">
                  <ArrowUpRight size={12} className="text-white/30" />
                </div>
              </div>
              <div
                onClick={() => nav('/tasks')}
                className="bg-gradient-to-br from-red-500 to-rose-500 p-4 rounded-xl cursor-pointer hover:shadow-lg hover:shadow-red-500/20 transition-all relative overflow-hidden"
              >
                <p className="text-white font-extrabold text-xl leading-none">{stats.overdueCount || 0}</p>
                <p className="text-white/60 text-[9px] font-bold uppercase mt-1 tracking-wider">Overdue</p>
                <div className="absolute right-2 bottom-2">
                  <PlayCircle size={12} className="text-white/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team + Progress */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Team</h2>
            <button onClick={() => nav('/analytics')} className="text-[10px] font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-wider">
              Analytics →
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 divide-y divide-slate-50 dark:divide-slate-700/50">
            {(() => {
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

              if (allMembers.length === 0) {
                return (
                  <div className="py-6 text-center">
                    <Users size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">No team members yet</p>
                    <p className="text-xs text-slate-400 mt-1">Create a project to get started</p>
                  </div>
                );
              }

              return allMembers.slice(0, 5).map((m, i) => (
                <div key={i} className="py-3 flex items-center gap-3 first:pt-1 last:pb-1">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">{m.user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{m.user.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{m.role}</p>
                  </div>
                  <span className="text-[9px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-lg">
                    {m.role}
                  </span>
                </div>
              ));
            })()}
          </div>

          {/* Progress Ring Card */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" className="stroke-slate-100 dark:stroke-slate-700" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${completionRate * 2.51} ${251 - completionRate * 2.51}`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-extrabold text-slate-800 dark:text-white">{completionRate}%</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Overall Progress</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{stats.doneCount} of {stats.totalTasks} tasks done</p>
                <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000" style={{ width: `${completionRate}%` }} />
                </div>
              </div>
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
