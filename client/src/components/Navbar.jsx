import { Search, Bell, MessageCircle, Moon, Globe, Maximize, Settings2, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

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
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#f8fafc] border-none rounded-xl py-2.5 pl-12 pr-4 text-sm text-slate-600 focus:ring-2 focus:ring-amber-500/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1 md:gap-2">
          <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-full transition-all">
            <Moon size={20} />
          </button>
          <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-full transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-full transition-all hidden sm:flex">
            <MessageCircle size={20} />
          </button>
          <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-full transition-all hidden sm:flex">
            <Globe size={20} />
          </button>
          <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-full transition-all hidden md:flex">
            <Maximize size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none mb-1">{user?.name || 'Nil Yeager'}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-500/20 overflow-hidden">
            <img 
              src={`https://i.pravatar.cc/150?u=${user?.id || 'admin'}`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600">
            <Settings2 size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
