import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI, dashboardAPI } from '../api';
import { 
  Users, 
  ArrowUpRight, 
  MoreVertical, 
  Plus, 
  Calendar as CalendarIcon,
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
  const [stats, setStats] = useState({ totalTasks: 0, doneCount: 0, inProgressCount: 0, todoCount: 0, totalProjects: 0 });
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

  const activityData = [
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 35 },
    { month: 'Mar', value: 30 },
    { month: 'Apr', value: 50 },
    { month: 'May', value: 45 },
    { month: 'Jun', value: 70 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Welcome + Quick Stats Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Hero Banner */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl min-h-[220px]"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #a78bfa 100%)' }}>
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-sm" />
          <div className="absolute bottom-4 left-1/2 w-24 h-24 bg-white/5 rounded-full" />
          <div className="relative z-10 p-8 flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white/90 text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                <Sparkles size={10} /> Dashboard
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Manage Your Team<br />Effectively With Us!
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
          {/* Illustration */}
          <div className="absolute right-0 bottom-0 w-[45%] h-full hidden md:block pointer-events-none">
            <img src="/banner.png" alt="" className="w-full h-full object-contain object-right-bottom scale-105 translate-y-2 opacity-90" />
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
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5 rounded-2xl p-5 flex items-center justify-between border border-indigo-500/10 dark:border-indigo-500/15">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Plus size={22} />
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-100">Start a new project</p>
            <p className="text-xs text-slate-400">Create and manage your team's tasks efficiently</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-[0.97] flex items-center gap-2"
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
            <button onClick={() => nav('/projects')} className="text-[10px] font-bold text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-wider">
              See All →
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-indigo-500" size={24} />
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm text-center border border-slate-100 dark:border-slate-700/50">
                <FolderKanban size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No projects yet</p>
                <button onClick={() => setShowCreate(true)} className="mt-3 text-xs font-bold text-indigo-500 hover:text-indigo-400">
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
                    className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group border border-slate-100 dark:border-slate-700/50 hover:border-indigo-500/20"
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors[index % 4]} flex items-center justify-center font-bold text-white text-sm shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors truncate">{project.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{project._count?.tasks || 0} Tasks · {project.members?.length || 0} Members</p>
                    </div>
                    <ArrowUpRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Activity</h2>
            <button onClick={() => nav('/calendar')} className="text-[10px] font-bold text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-wider">
              Calendar →
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Weekly Progress</p>
                <p className="text-[10px] text-slate-400 font-medium">Task completion trends</p>
              </div>
              <div onClick={() => nav('/calendar')} className="w-8 h-8 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                <CalendarIcon size={14} />
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-[130px] mb-4">
              {activityData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative rounded-lg overflow-hidden" style={{ height: `${d.value}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500 to-violet-400 opacity-20 group-hover:opacity-40 transition-opacity rounded-lg" />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500 to-violet-400 rounded-lg hover:opacity-100 opacity-30 hover:opacity-80 transition-all cursor-pointer" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400">{d.month}</span>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => nav('/tasks')}
                className="bg-gradient-to-br from-amber-500 to-orange-500 p-4 rounded-xl cursor-pointer hover:shadow-lg hover:shadow-amber-500/20 transition-all group"
              >
                <p className="text-white font-extrabold text-xl leading-none">{stats.todoCount + stats.inProgressCount}</p>
                <p className="text-white/60 text-[9px] font-bold uppercase mt-1 tracking-wider">Pending</p>
                <div className="absolute right-2 bottom-2">
                  <ArrowUpRight size={12} className="text-white/30" />
                </div>
              </div>
              <div
                onClick={() => nav('/tasks')}
                className="bg-gradient-to-br from-pink-500 to-rose-500 p-4 rounded-xl cursor-pointer hover:shadow-lg hover:shadow-pink-500/20 transition-all group"
              >
                <p className="text-white font-extrabold text-xl leading-none">{stats.todoCount}</p>
                <p className="text-white/60 text-[9px] font-bold uppercase mt-1 tracking-wider">New Tasks</p>
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
            <button onClick={() => nav('/analytics')} className="text-[10px] font-bold text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-wider">
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

              const membersToShow = allMembers.length > 0
                ? allMembers.slice(0, 4).map(m => ({ name: m.user.name, sub: m.role, avatar: `https://i.pravatar.cc/100?u=${m.userId}` }))
                : [
                    { name: 'Nil Yeager', sub: '3 Tasks completed', avatar: 'https://i.pravatar.cc/100?u=11' },
                    { name: 'Theron Trump', sub: '4 Tasks completed', avatar: 'https://i.pravatar.cc/100?u=12' },
                    { name: 'Tyler Mark', sub: '5 Tasks completed', avatar: 'https://i.pravatar.cc/100?u=13' },
                    { name: 'Johen Mark', sub: '6 Tasks completed', avatar: 'https://i.pravatar.cc/100?u=14' },
                  ];

              return membersToShow.map((m, i) => (
                <div key={i} className="py-3 flex items-center gap-3 first:pt-1 last:pb-1">
                  <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white dark:ring-slate-700 shadow-sm">
                    <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{m.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{m.sub}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); nav('/settings'); }}
                    className="text-[9px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                  >
                    Profile
                  </button>
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
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
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
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000" style={{ width: `${completionRate}%` }} />
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
            <button type="submit" disabled={creating} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.97] disabled:opacity-50">
              {creating ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Create</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
