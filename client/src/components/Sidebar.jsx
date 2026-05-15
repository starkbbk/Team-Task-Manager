import { NavLink } from 'react-router-dom';
import { Home, FolderKanban, ListTodo, BarChart3, LogOut, ClipboardList } from 'lucide-react';
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
    <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 transition-all duration-300 z-50 ${isOpen ? 'w-20' : 'w-0 -translate-x-full'} md:w-24 md:translate-x-0 flex flex-col items-center py-6 shadow-sm`}>
      {/* Logo */}
      <div className="mb-10 text-amber-500">
        <ClipboardList size={32} strokeWidth={2.5} />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-6">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 group relative
              ${isActive ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`
            }
            title={item.label}
          >
            {item.icon}
            {/* Tooltip for desktop */}
            <span className="absolute left-16 bg-slate-800 dark:bg-slate-600 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 group relative mt-auto"
        title="Logout"
      >
        <LogOut size={22} />
        <span className="absolute left-16 bg-red-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          Logout
        </span>
      </button>
    </aside>
  );
};

export default Sidebar;
