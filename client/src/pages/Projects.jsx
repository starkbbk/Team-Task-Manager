import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../api';
import Modal from '../components/Modal';
import { Plus, FolderKanban, Users, ListTodo, Loader2, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await projectAPI.getAll();
      setProjects(res.data.projects);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
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
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to create project'); }
    finally { setCreating(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-primary-500" size={32} />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-100">Projects</h1>
          <p className="text-dark-400 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button id="create-project-btn" onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FolderKanban size={48} className="text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-200 mb-2">No projects yet</h3>
          <p className="text-dark-400 mb-6">Create your first project to get started</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus size={18} /> Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => (
            <Link key={p.id} to={`/projects/${p.id}`} className="glass-card-hover p-5 group block">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FolderKanban size={20} className="text-primary-400" />
                </div>
                {p.userRole === 'ADMIN' && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/20">
                    <Crown size={12} /> Admin
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-dark-100 mb-1 group-hover:text-primary-300 transition-colors">{p.name}</h3>
              {p.description && <p className="text-sm text-dark-400 line-clamp-2 mb-4">{p.description}</p>}
              <div className="flex items-center gap-4 mt-auto pt-3 border-t border-dark-700/50 text-xs text-dark-400">
                <span className="flex items-center gap-1.5"><Users size={14} /> {p.members?.length || 0}</span>
                <span className="flex items-center gap-1.5"><ListTodo size={14} /> {p._count?.tasks || 0} tasks</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Project Name</label>
            <input id="project-name-input" value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="My Awesome Project" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">Description (optional)</label>
            <textarea id="project-desc-input" value={description} onChange={e => setDescription(e.target.value)} className="input-field resize-none" rows={3} placeholder="What's this project about?" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={creating} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {creating ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Create</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
