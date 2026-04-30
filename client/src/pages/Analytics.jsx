import { useState, useEffect } from 'react';
import { projectAPI } from '../api';
import { BarChart3, TrendingUp, CheckCircle2, Clock, AlertCircle, FolderKanban, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [stats, setStats] = useState({ projects: 0, totalTasks: 0, done: 0, inProgress: 0, todo: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await projectAPI.getAll();
      const projects = res.data.projects;
      let totalTasks = 0, done = 0, inProgress = 0, todo = 0;
      for (const project of projects) {
        try {
          const projRes = await projectAPI.getOne(project.id);
          const tasks = projRes.data.project.tasks || [];
          totalTasks += tasks.length;
          done += tasks.filter(t => t.status === 'DONE').length;
          inProgress += tasks.filter(t => t.status === 'IN_PROGRESS').length;
          todo += tasks.filter(t => t.status === 'TODO').length;
        } catch {}
      }
      setStats({ projects: projects.length, totalTasks, done, inProgress, todo });
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.done / stats.totalTasks) * 100) : 0;

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-amber-500" size={32} />
    </div>
  );

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: <FolderKanban size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Tasks', value: stats.totalTasks, icon: <BarChart3 size={20} />, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Completed', value: stats.done, icon: <CheckCircle2 size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'In Progress', value: stats.inProgress, icon: <Clock size={20} />, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'To Do', value: stats.todo, icon: <AlertCircle size={20} />, color: 'text-pink-500', bg: 'bg-pink-50' },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: <TrendingUp size={20} />, color: 'text-teal-500', bg: 'bg-teal-50' },
  ];

  const barData = [
    { label: 'To Do', value: stats.todo, color: 'bg-blue-500', max: stats.totalTasks || 1 },
    { label: 'In Progress', value: stats.inProgress, color: 'bg-amber-500', max: stats.totalTasks || 1 },
    { label: 'Done', value: stats.done, color: 'bg-emerald-500', max: stats.totalTasks || 1 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Overview of your team's performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-[20px] shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-extrabold text-slate-800">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Distribution */}
        <div className="bg-white p-8 rounded-[24px] shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Task Distribution</h3>
          <div className="space-y-6">
            {barData.map(bar => (
              <div key={bar.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-600">{bar.label}</span>
                  <span className="text-sm font-bold text-slate-800">{bar.value}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${bar.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${(bar.value / bar.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Rate Circle */}
        <div className="bg-white p-8 rounded-[24px] shadow-sm flex flex-col items-center justify-center">
          <h3 className="font-bold text-slate-800 mb-8">Completion Rate</h3>
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="#f59e0b" strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${completionRate * 2.64} ${264 - completionRate * 2.64}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-extrabold text-slate-800">{completionRate}%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complete</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-6">{stats.done} of {stats.totalTasks} tasks completed</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
