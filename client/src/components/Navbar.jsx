import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Moon, Sun, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const nav = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      nav('/projects');
    }
  };

  const notifications = [
    { id: 1, text: 'New task assigned to you', time: '2 min ago' },
    { id: 2, text: 'Project deadline approaching', time: '1 hour ago' },
    { id: 3, text: 'Team member joined your project', time: '3 hours ago' },
  ];

  return (
    <header className="h-20 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between px-6 sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f8fafc] dark:bg-slate-700 border-none rounded-xl py-2.5 pl-12 pr-4 text-sm text-slate-600 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </form>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1 md:gap-2">
          <button 
            onClick={(e) => toggleTheme(e)}
            className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-all"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowNotif(!showNotif)}
              className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-all relative"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>
            {/* Notification Dropdown */}
            {showNotif && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Notifications</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-700 last:border-0">
                        <p className="text-sm text-slate-700 dark:text-slate-300">{n.text}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-slate-700 ml-2 relative">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none mb-1">{user?.name || 'User'}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user?.role || 'Member'}</p>
          </div>
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-500/20 overflow-hidden cursor-pointer hover:border-amber-500/50 transition-colors flex items-center justify-center"
          >
            <span className="text-amber-700 dark:text-amber-400 font-bold text-sm">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>

          {/* User dropdown */}
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-14 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => { setShowUserMenu(false); logout(); }}
                  className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2 font-medium"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
