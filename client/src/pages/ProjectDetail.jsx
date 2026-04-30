import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, taskAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import TaskCard from '../components/TaskCard';
import { format } from 'date-fns';
import { ArrowLeft, Plus, Users, Settings, Trash2, UserPlus, UserMinus, Loader2, Crown, ListTodo } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assigneeId: '', dueDate: '', priority: 'MEDIUM' });
  const [submitting, setSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { fetchProject(); }, [id]);

  const fetchProject = async () => {
    try {
      const res = await projectAPI.getOne(id);
      setProject(res.data.project);
      setEditForm({ name: res.data.project.name, description: res.data.project.description || '' });
    } catch { toast.error('Failed to load project'); nav('/projects'); }
    finally { setLoading(false); }
  };

  const isAdmin = project?.userRole === 'ADMIN';

  const handleAddMember = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await projectAPI.addMember(id, memberEmail);
      toast.success('Member added!');
      setShowAddMember(false); setMemberEmail('');
      fetchProject();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to add member'); }
    finally { setSubmitting(false); }
  };

  const handleRemoveMember = async (userId, name) => {
    if (!confirm(`Remove ${name} from this project?`)) return;
    try {
      await projectAPI.removeMember(id, userId);
      toast.success('Member removed');
      fetchProject();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to remove member'); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await taskAPI.create(id, taskForm);
      toast.success('Task created!');
      setShowCreateTask(false);
      setTaskForm({ title: '', description: '', assigneeId: '', dueDate: '', priority: 'MEDIUM' });
      fetchProject();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to create task'); }
    finally { setSubmitting(false); }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await taskAPI.update(editingTask.id, taskForm);
      toast.success('Task updated!');
      setShowEditTask(false); setEditingTask(null);
      fetchProject();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to update task'); }
    finally { setSubmitting(false); }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskAPI.update(taskId, { status });
      toast.success('Status updated');
      fetchProject();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to update status'); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskAPI.delete(taskId);
      toast.success('Task deleted');
      fetchProject();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to delete task'); }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await projectAPI.update(id, editForm);
      toast.success('Project updated!');
      setShowEditProject(false);
      fetchProject();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to update'); }
    finally { setSubmitting(false); }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Delete this project and all its tasks? This cannot be undone.')) return;
    try {
      await projectAPI.delete(id);
      toast.success('Project deleted');
      nav('/projects');
    } catch { toast.error('Failed to delete project'); }
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      assigneeId: task.assigneeId || '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      priority: task.priority,
    });
    setShowEditTask(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-primary-500" size={32} />
    </div>
  );

  if (!project) return null;

  const filteredTasks = project.tasks?.filter(t => filter === 'ALL' || t.status === filter) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button onClick={() => nav('/projects')} className="p-2 rounded-xl text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors mt-1">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-dark-100">{project.name}</h1>
            {project.description && <p className="text-dark-400 mt-1">{project.description}</p>}
            <div className="flex items-center gap-3 mt-2">
              {isAdmin && <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/20"><Crown size={12} /> Admin</span>}
              <span className="text-xs text-dark-500">Created {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button onClick={() => setShowEditProject(true)} className="btn-secondary flex items-center gap-2 text-sm"><Settings size={16} /> Edit</button>
            <button onClick={handleDeleteProject} className="btn-danger flex items-center gap-2 text-sm"><Trash2 size={16} /> Delete</button>
          </div>
        )}
      </div>

      {/* Members */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark-100 flex items-center gap-2"><Users size={20} /> Members ({project.members?.length || 0})</h2>
          {isAdmin && (
            <button onClick={() => setShowAddMember(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors">
              <UserPlus size={14} /> Add
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {project.members?.map(m => (
            <div key={m.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-900/50 border border-dark-700/50 group">
              <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">{m.user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-dark-200">{m.user.name}</p>
                <p className="text-xs text-dark-500">{m.role}</p>
              </div>
              {isAdmin && m.userId !== user.id && (
                <button onClick={() => handleRemoveMember(m.userId, m.user.name)} className="ml-2 p-1 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all">
                  <UserMinus size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark-100 flex items-center gap-2">
            <ListTodo size={20} /> Tasks ({project.tasks?.length || 0})
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex bg-dark-800 rounded-xl p-0.5 border border-dark-700/50">
              {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-primary-500/20 text-primary-400' : 'text-dark-400 hover:text-dark-200'}`}>
                  {f === 'ALL' ? 'All' : f === 'IN_PROGRESS' ? 'In Progress' : f === 'TODO' ? 'To Do' : 'Done'}
                </button>
              ))}
            </div>
            {isAdmin && (
              <button onClick={() => { setTaskForm({ title: '', description: '', assigneeId: '', dueDate: '', priority: 'MEDIUM' }); setShowCreateTask(true); }}
                className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> Add Task</button>
            )}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <ListTodo size={36} className="text-dark-600 mx-auto mb-3" />
            <p className="text-dark-400">{filter === 'ALL' ? 'No tasks yet' : 'No tasks with this status'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map(t => (
              <TaskCard key={t.id} task={t} isAdmin={isAdmin} isAssignee={t.assigneeId === user.id}
                onStatusChange={handleStatusChange} onDelete={handleDeleteTask} onEdit={openEditTask} />
            ))}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      <Modal isOpen={showAddMember} onClose={() => setShowAddMember(false)} title="Add Member">
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">User Email</label>
            <input value={memberEmail} onChange={e => setMemberEmail(e.target.value)} className="input-field" placeholder="user@example.com" type="email" required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAddMember(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Adding...' : 'Add Member'}</button>
          </div>
        </form>
      </Modal>

      {/* Create/Edit Task Modal */}
      <Modal isOpen={showCreateTask || showEditTask} onClose={() => { setShowCreateTask(false); setShowEditTask(false); setEditingTask(null); }}
        title={showEditTask ? 'Edit Task' : 'Create Task'}>
        <form onSubmit={showEditTask ? handleEditTask : handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Title</label>
            <input value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="input-field" placeholder="Task title" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
            <textarea value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} className="input-field resize-none" rows={3} placeholder="Optional description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Assignee</label>
              <select value={taskForm.assigneeId} onChange={e => setTaskForm({...taskForm, assigneeId: e.target.value})} className="input-field">
                <option value="">Unassigned</option>
                {project.members?.map(m => <option key={m.userId} value={m.userId}>{m.user.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Priority</label>
              <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})} className="input-field">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Due Date</label>
            <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} className="input-field" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setShowCreateTask(false); setShowEditTask(false); }} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Saving...' : showEditTask ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* Edit Project Modal */}
      <Modal isOpen={showEditProject} onClose={() => setShowEditProject(false)} title="Edit Project">
        <form onSubmit={handleEditProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Project Name</label>
            <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
            <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="input-field resize-none" rows={3} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowEditProject(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Saving...' : 'Update'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetail;
