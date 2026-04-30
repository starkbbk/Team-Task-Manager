import { useState, useEffect } from 'react';
import { projectAPI } from '../api';
import { ListTodo, Filter, Clock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const nav = useNavigate();

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const res = await projectAPI.getAll();
      const projects = res.data.projects;
      // Collect all tasks from all projects
      const allTasks = [];
      for (const project of projects) {
        try {
          const projRes = await projectAPI.getOne(project.id);
          const proj = projRes.data.project;
          if (proj.tasks) {
            proj.tasks.forEach(t => {
              allTasks.push({ ...t, projectName: proj.name, projectId: proj.id });
            });
          }
        } catch {}
      }
      setTasks(allTasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filtered = tasks.filter(t => filter === 'ALL' || t.status === filter);

  const statusIcon = {
    TODO: <Clock size={14} className="text-blue-500" />,
    IN_PROGRESS: <AlertCircle size={14} className="text-amber-500" />,
    DONE: <CheckCircle2 size={14} className="text-emerald-500" />,
  };

  const statusLabel = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };
  const priorityColor = { LOW: 'bg-blue-100 text-blue-600', MEDIUM: 'bg-amber-100 text-amber-600', HIGH: 'bg-red-100 text-red-600' };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-amber-500" size={32} />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">All Tasks</h1>
          <p className="text-slate-400 text-sm mt-1">{tasks.length} total tasks across all projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-white text-slate-500 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {f === 'ALL' ? 'All' : statusLabel[f]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-[24px] shadow-sm text-center">
          <ListTodo size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No tasks found</h3>
          <p className="text-slate-400 text-sm">Tasks from your projects will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Task</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignee</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(task => (
                <tr
                  key={task.id}
                  onClick={() => nav(`/projects/${task.projectId}`)}
                  className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">{task.title}</p>
                    {task.description && <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{task.description}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">{task.projectName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                      {statusIcon[task.status]} {statusLabel[task.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${priorityColor[task.priority]}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">{task.assignee?.name || 'Unassigned'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Tasks;
