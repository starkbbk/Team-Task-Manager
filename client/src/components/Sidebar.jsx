import { NavLink } from 'react-router-dom';
import { Home, FolderKanban, ListTodo, BarChart3, LogOut, ClipboardList, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  const menuItems = [
    { icon: <Home size={22} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FolderKanban size={22} />, label: 'Projects', path: '/projects' },
    { icon: <ListTodo size={22} />, label: 'Tasks', path: '/tasks' },
    { icon: <BarChart3 size={22} />, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" onClick={toggleSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 transition-all duration-300 z-50 flex flex-col items-center py-6 shadow-sm
        ${isOpen ? 'w-64 md:w-24 translate-x-0' : 'w-64 md:w-24 -translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Header */}
        <div className="w-full flex items-center justify-between px-6 mb-8 md:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <ClipboardList size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 dark:text-white text-sm">Task Manager</span>
          </div>
          <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="mb-10 text-amber-500 hidden md:block">
          <ClipboardList size={32} strokeWidth={2.5} />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 flex flex-col gap-2 md:gap-6 w-full md:w-auto px-4 md:px-0">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => { if (isOpen) toggleSidebar(); }}
              className={({ isActive }) => 
                `flex items-center gap-3 md:justify-center md:w-12 md:h-12 px-4 py-3 md:p-0 rounded-xl md:rounded-2xl transition-all duration-300 group relative
                ${isActive ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-sm font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`
              }
              title={item.label}
            >
              {item.icon}
              {/* Label visible on mobile only */}
              <span className="text-sm md:hidden">{item.label}</span>
              {/* Tooltip for desktop */}
              <span className="absolute left-16 bg-slate-800 dark:bg-slate-600 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 hidden md:block">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={() => { logout(); if (isOpen) toggleSidebar(); }}
          className="flex items-center gap-3 md:justify-center md:w-12 md:h-12 w-full px-8 py-3 md:p-0 rounded-xl md:rounded-2xl text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 group relative mt-auto"
          title="Logout"
        >
          <LogOut size={22} />
          <span className="text-sm md:hidden">Logout</span>
          <span className="absolute left-16 bg-red-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 hidden md:block">
            Logout
          </span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
