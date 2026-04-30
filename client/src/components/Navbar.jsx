import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, MessageCircle, Moon, Sun, Maximize, Settings2, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const nav = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to projects page which shows project listings
      nav('/projects');
    }
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const notifications = [
    { id: 1, text: 'New task assigned to you', time: '2 min ago' },
    { id: 2, text: 'Project deadline approaching', time: '1 hour ago' },
    { id: 3, text: 'Team member joined your project', time: '3 hours ago' },
  ];

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f8fafc] border-none rounded-xl py-2.5 pl-12 pr-4 text-sm text-slate-600 focus:ring-2 focus:ring-amber-500/10 outline-none transition-all"
          />
        </form>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1 md:gap-2">
          <button 
            onClick={toggleDarkMode}
            className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-full transition-all"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowNotif(!showNotif)}
              className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-full transition-all relative"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            {/* Notification Dropdown */}
            {showNotif && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-100">
                    <p className="font-bold text-sm text-slate-800">Notifications</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0">
                        <p className="text-sm text-slate-700">{n.text}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-100">
                    <button 
                      onClick={() => { setShowNotif(false); nav('/settings'); }}
                      className="text-xs font-bold text-amber-500 hover:text-amber-600 w-full text-center"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <button 
            onClick={() => nav('/chat')}
            className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-full transition-all hidden sm:flex"
            title="Chat"
          >
            <MessageCircle size={20} />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-full transition-all hidden md:flex"
            title="Fullscreen"
          >
            <Maximize size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none mb-1">{user?.name || 'User'}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Admin</p>
          </div>
          <div 
            onClick={() => nav('/settings')}
            className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-500/20 overflow-hidden cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            <img 
              src={`https://i.pravatar.cc/150?u=${user?.id || 'admin'}`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            onClick={() => nav('/settings')}
            className="p-2 text-slate-400 hover:text-slate-600"
            title="Settings"
          >
            <Settings2 size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
