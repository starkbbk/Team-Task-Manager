import { format, isPast } from 'date-fns';
import { Calendar, User, Trash2, ArrowRight } from 'lucide-react';

const priorityConfig = {
  LOW: { class: 'badge-low', label: 'Low' },
  MEDIUM: { class: 'badge-medium', label: 'Medium' },
  HIGH: { class: 'badge-high', label: 'High' },
};

const statusConfig = {
  TODO: { class: 'status-todo', label: 'To Do', next: 'IN_PROGRESS', nextLabel: 'Start' },
  IN_PROGRESS: { class: 'status-in-progress', label: 'In Progress', next: 'DONE', nextLabel: 'Complete' },
  DONE: { class: 'status-done', label: 'Done', next: null, nextLabel: null },
};

const TaskCard = ({ task, isAdmin, isAssignee, onStatusChange, onDelete, onEdit }) => {
  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;
  const status = statusConfig[task.status] || statusConfig.TODO;
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'DONE';

  return (
    <div className={`glass-card p-4 space-y-3 transition-all duration-300 hover:border-dark-600 ${
      isOverdue ? 'border-red-500/30' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-dark-100 truncate">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-dark-400 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${priority.class}`}>
            {priority.label}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-dark-400">
        {task.assignee && (
          <div className="flex items-center gap-1.5">
            <User size={12} />
            <span>{task.assignee.name}</span>
          </div>
        )}
        {task.dueDate && (
          <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-400' : ''}`}>
            <Calendar size={12} />
            <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-dark-700/50">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${status.class}`}>
          {status.label}
        </span>

        <div className="flex items-center gap-2">
          {/* Status change button */}
          {status.next && (isAdmin || isAssignee) && (
            <button
              onClick={() => onStatusChange(task.id, status.next)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-colors"
            >
              {status.nextLabel}
              <ArrowRight size={12} />
            </button>
          )}

          {/* Admin actions */}
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors"
                title="Edit task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
