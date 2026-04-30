import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { FolderKanban, ListTodo, Clock, CheckCircle2, AlertTriangle, Loader2, TrendingUp, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardAPI.get();
      setData(res.data);
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-primary-500" size={32} />
    </div>
  );

  const s = data?.stats || {};
  const cards = [
    { label: 'Projects', value: s.totalProjects||0, icon: FolderKanban, bg: 'bg-primary-500/10', tc: 'text-primary-400' },
    { label: 'Total Tasks', value: s.totalTasks||0, icon: ListTodo, bg: 'bg-blue-500/10', tc: 'text-blue-400' },
    { label: 'To Do', value: s.todoCount||0, icon: Clock, bg: 'bg-amber-500/10', tc: 'text-amber-400' },
    { label: 'In Progress', value: s.inProgressCount||0, icon: TrendingUp, bg: 'bg-cyan-500/10', tc: 'text-cyan-400' },
    { label: 'Completed', value: s.doneCount||0, icon: CheckCircle2, bg: 'bg-emerald-500/10', tc: 'text-emerald-400' },
    { label: 'Overdue', value: s.overdueCount||0, icon: AlertTriangle, bg: 'bg-red-500/10', tc: 'text-red-400' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-dark-100">Welcome back, <span className="gradient-text">{user?.name}</span></h1>
        <p className="text-dark-400 mt-2">Here's what's happening across your projects</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map(c => (
          <div key={c.label} className="glass-card-hover p-4 group">
            <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <c.icon size={20} className={c.tc} />
            </div>
            <p className="text-2xl font-bold text-dark-100">{c.value}</p>
            <p className="text-xs text-dark-400 mt-1 font-medium">{c.label}</p>
          </div>
        ))}
      </div>

      {s.totalTasks > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-dark-100 mb-4">Task Progress</h2>
          <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
            <div className="h-full flex">
              <div className="bg-emerald-500 transition-all duration-1000" style={{ width: `${(s.doneCount/s.totalTasks)*100}%` }} />
              <div className="bg-blue-500 transition-all duration-1000" style={{ width: `${(s.inProgressCount/s.totalTasks)*100}%` }} />
              <div className="bg-dark-500 transition-all duration-1000" style={{ width: `${(s.todoCount/s.totalTasks)*100}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-6 mt-3 text-xs text-dark-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Done ({s.doneCount})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span>In Progress ({s.inProgressCount})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-dark-500"></span>To Do ({s.todoCount})</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-100 flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-400" /> Overdue Tasks
            </h2>
            {(data?.overdueTasks?.length||0) > 0 && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/20">{data.overdueTasks.length}</span>
            )}
          </div>
          {data?.overdueTasks?.length > 0 ? (
            <div className="space-y-3">
              {data.overdueTasks.map(t => (
                <Link key={t.id} to={`/projects/${t.project.id}`} className="block p-3 rounded-xl bg-dark-900/50 border border-dark-700/50 hover:border-red-500/20 transition-all group">
                  <div className="flex items-start justify-between gap-2">
                    <div><p className="text-sm font-medium text-dark-200">{t.title}</p><p className="text-xs text-dark-500 mt-1">{t.project.name}</p></div>
                    <span className="text-xs text-red-400 whitespace-nowrap">Due {format(new Date(t.dueDate), 'MMM d')}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8"><CheckCircle2 size={32} className="text-emerald-500/50 mx-auto mb-2" /><p className="text-sm text-dark-400">No overdue tasks! 🎉</p></div>
          )}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-dark-100 mb-4">Quick Access</h2>
          {data?.recentProjects?.length > 0 ? (
            <div className="space-y-3">
              {data.recentProjects.map(p => (
                <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center justify-between p-3 rounded-xl bg-dark-900/50 border border-dark-700/50 hover:border-primary-500/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center"><FolderKanban size={16} className="text-primary-400" /></div>
                    <span className="text-sm font-medium text-dark-200">{p.name}</span>
                  </div>
                  <ArrowRight size={16} className="text-dark-500 group-hover:text-primary-400 transition-colors" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8"><FolderKanban size={32} className="text-dark-600 mx-auto mb-2" /><p className="text-sm text-dark-400">No projects yet</p>
              <Link to="/projects" className="btn-primary inline-flex items-center gap-2 mt-4 text-sm">Create Project</Link>
            </div>
          )}
          {data?.recentProjects?.length > 0 && (
            <Link to="/projects" className="flex items-center justify-center gap-2 mt-4 px-4 py-2.5 rounded-xl text-sm font-medium text-primary-400 hover:bg-primary-500/10 transition-colors">View all projects <ArrowRight size={16} /></Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
