import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI, dashboardAPI } from '../api';
import { 
  Users, 
  ArrowUpRight, 
  MoreVertical, 
  Plus, 
  Calendar as CalendarIcon,
  PlayCircle
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

  // Calculate active member count from all projects
  const activeMemberCount = new Set(
    projects.flatMap(p => (p.members || []).map(m => m.userId))
  ).size;

  const activityData = [
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 35 },
    { month: 'Mar', value: 30 },
    { month: 'Apr', value: 50 },
    { month: 'May', value: 45 },
    { month: 'Jun', value: 70 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative bg-[#4fd1c5] rounded-[32px] p-8 md:p-12 overflow-hidden flex items-center min-h-[280px]">
          <div className="relative z-10 max-w-md">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
              Manage Your Team Effectively With Us!
            </h1>
            <p className="text-white/80 mb-8 font-medium">
              Track projects, tasks, and team progress in one seamless dashboard.
            </p>
            <div className="flex gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <Users className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-white font-bold text-xl">{activeMemberCount || '0'}+</p>
                  <p className="text-white/60 text-xs font-semibold">Active Members</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <ArrowUpRight className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-white font-bold text-xl">{stats.doneCount || '0'}+</p>
                  <p className="text-white/60 text-xs font-semibold">Tasks Completed</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 h-full hidden md:block">
            <img 
              src="/banner.png" 
              alt="Banner Illustration" 
              className="w-full h-full object-contain object-right-bottom scale-110 translate-y-4"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 shadow-sm flex flex-col justify-center items-center text-center">
          <p className="text-slate-400 font-bold text-sm mb-6 max-w-[180px]">
            Have more projects to manage?
          </p>
          <button 
            onClick={() => setShowCreate(true)}
            className="bg-[#00a3ff] hover:bg-[#0088d6] text-white w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] mb-8"
          >
            <Plus size={20} />
            <span>Create New Project</span>
          </button>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
              <p className="text-[10px] font-bold text-[#00a3ff] uppercase tracking-wider mb-1">In Progress</p>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{stats.inProgressCount + stats.todoCount}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Completed</p>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{stats.doneCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Projects (List) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Recent Projects</h2>
            <button 
              onClick={() => nav('/projects')}
              className="text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors"
            >
              See All
            </button>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              [1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl animate-pulse"></div>)
            ) : projects.length === 0 ? (
              <p className="text-slate-400 text-sm">No projects found. Create one to get started!</p>
            ) : (
              projects.slice(0, 4).map((project, index) => (
                <div 
                  key={project.id} 
                  onClick={() => nav(`/projects/${project.id}`)}
                  className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg
                    ${index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-pink-500' : index === 2 ? 'bg-emerald-400' : 'bg-blue-500'}`}>
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 transition-colors">{project.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{project._count?.tasks || 0} Tasks</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nav(`/projects/${project.id}`); }}
                    className="text-amber-500 bg-amber-50 dark:bg-amber-500/15 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-amber-100 dark:hover:bg-amber-500/25 transition-colors"
                  >
                    View
                  </button>
                  <MoreVertical size={16} className="text-slate-300" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Current Activity</h2>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Weekly Progress</p>
                <p className="text-[10px] text-slate-400 font-medium">This is the latest Improvement</p>
              </div>
              <div 
                onClick={() => nav('/calendar')}
                className="w-8 h-8 bg-blue-50 dark:bg-blue-500/15 text-blue-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-500/25 transition-colors"
              >
                <CalendarIcon size={16} />
              </div>
            </div>
            
            {/* Simple CSS Chart */}
            <div className="flex-1 flex items-end justify-between gap-2 min-h-[150px]">
              {activityData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-blue-400/20 rounded-t-lg relative group transition-all"
                    style={{ height: `${d.value}%` }}
                  >
                    <div className="absolute inset-0 bg-blue-500 rounded-t-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-center"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{d.month}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div 
                onClick={() => nav('/tasks')}
                className="bg-amber-400 p-4 rounded-2xl relative overflow-hidden group cursor-pointer hover:bg-amber-500 transition-colors"
              >
                <p className="text-white font-bold text-lg leading-none">{stats.todoCount + stats.inProgressCount}</p>
                <p className="text-white/70 text-[8px] font-bold uppercase mt-1">Pending Tasks</p>
                <div className="absolute right-2 bottom-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white">
                  <ArrowUpRight size={12} />
                </div>
              </div>
              <div 
                onClick={() => nav('/tasks')}
                className="bg-pink-500 p-4 rounded-2xl relative overflow-hidden group cursor-pointer hover:bg-pink-600 transition-colors"
              >
                <p className="text-white font-bold text-lg leading-none">{stats.todoCount}</p>
                <p className="text-white/70 text-[8px] font-bold uppercase mt-1">New Tasks</p>
                <div className="absolute right-2 bottom-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white">
                  <PlayCircle size={12} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Best Performers</h2>
            <button 
              onClick={() => nav('/analytics')}
              className="text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors"
            >
              See All
            </button>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-[32px] shadow-sm divide-y divide-slate-50 dark:divide-slate-700">
            {/* Show real project members if available, otherwise show placeholder */}
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
              
              if (allMembers.length > 0) {
                return allMembers.slice(0, 4).map((m, i) => (
                  <div key={m.userId} className="py-4 flex items-center gap-4 first:pt-2 last:pb-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                      <img src={`https://i.pravatar.cc/100?u=${m.userId}`} alt="User" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{m.user.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{m.role}</p>
                    </div>
                    <button 
                      onClick={() => nav('/settings')}
                      className="text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Profile
                    </button>
                  </div>
                ));
              }
              
              // Fallback placeholder members
              return [1,2,3,4].map((i) => (
                <div key={i} className="py-4 flex items-center gap-4 first:pt-2 last:pb-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                    <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="User" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {i === 1 ? 'Nil Yeager' : i === 2 ? 'Theron Trump' : i === 3 ? 'Tyler Mark' : 'Johen Mark'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">{i + 2} Tasks completed</p>
                  </div>
                  <button 
                    onClick={() => nav('/settings')}
                    className="text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Profile
                  </button>
                </div>
              ));
            })()}
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm">
             <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Content Usage</p>
                <MoreVertical size={16} className="text-slate-300" />
             </div>
             <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: `${stats.totalTasks > 0 ? Math.round((stats.doneCount / stats.totalTasks) * 100) : 0}%` }}></div>
             </div>
             <p className="text-[10px] text-slate-400 font-bold mt-2">{stats.totalTasks > 0 ? Math.round((stats.doneCount / stats.totalTasks) * 100) : 0}% tasks completed</p>
          </div>
        </div>

      </div>

      {/* Create Project Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Project Name</label>
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
            <label className="block text-sm font-medium text-dark-300 mb-2">Description (optional)</label>
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
            <button type="submit" disabled={creating} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {creating ? <span className="animate-spin">⏳</span> : <><Plus size={18} /> Create</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
