import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, Apple, Chrome } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] flex items-center justify-center p-4 md:p-8">
      <div className="bg-[#f5f2eb] w-full max-w-6xl min-h-[700px] rounded-[40px] shadow-2xl flex overflow-hidden border-[12px] border-white/30 backdrop-blur-sm">
        
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
          
          {/* Logo Area */}
          <div className="absolute top-10 left-10">
            <div className="px-6 py-2 bg-white rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
              <div className="w-6 h-6 bg-amber-500 rounded-full"></div>
              <span className="font-semibold text-slate-700">Crextio</span>
            </div>
          </div>

          <div className="max-w-md mx-auto w-full">
            <h1 className="text-4xl font-semibold text-slate-800 mb-2">Welcome back</h1>
            <p className="text-slate-500 mb-10">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 ml-5 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-none rounded-full px-6 py-4 text-slate-700 shadow-inner focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 ml-5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border-none rounded-full px-6 py-4 text-slate-700 shadow-inner focus:ring-2 focus:ring-amber-500/20 transition-all outline-none pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#fcd34d] hover:bg-[#fbbf24] text-slate-800 font-bold py-4 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50 mt-4 text-lg"
              >
                {loading ? 'Processing...' : 'Submit'}
              </button>
            </form>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button className="flex items-center justify-center gap-2 py-3 border border-slate-300 rounded-full hover:bg-white transition-colors text-slate-600 font-medium">
                <Apple size={18} />
                <span>Apple</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-slate-300 rounded-full hover:bg-white transition-colors text-slate-600 font-medium">
                <Chrome size={18} />
                <span>Google</span>
              </button>
            </div>

            <div className="mt-10 flex justify-between text-sm">
              <p className="text-slate-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-slate-800 font-bold border-b border-slate-800 pb-0.5">
                  Sign up
                </Link>
              </p>
              <Link to="#" className="text-slate-500 border-b border-slate-300 pb-0.5">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Hero Image */}
        <div className="hidden lg:block lg:w-1/2 p-6">
          <div className="relative h-full w-full rounded-[32px] overflow-hidden">
            <img 
              src="/hero.png" 
              alt="Team collaborating" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10"></div>
            
            {/* Mock Floating Widgets to match reference */}
            <div className="absolute top-10 left-10 bg-amber-300/90 backdrop-blur px-6 py-4 rounded-2xl shadow-xl">
               <p className="text-xs font-bold text-slate-800 mb-1">Project Planning</p>
               <p className="text-[10px] text-slate-600">10:30am - 11:30am</p>
            </div>

            <div className="absolute bottom-20 left-10 bg-white/90 backdrop-blur px-8 py-6 rounded-3xl shadow-2xl max-w-[280px]">
               <div className="flex justify-between items-center mb-4">
                 <p className="font-bold text-slate-800">Weekly Sync</p>
                 <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
               </div>
               <p className="text-xs text-slate-500 mb-4">02:00pm - 03:00pm</p>
               <div className="flex -space-x-2">
                 {[5,6,7,8].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="avatar" />
                   </div>
                 ))}
               </div>
            </div>

            {/* X Close Button Mock */}
            <div className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-800 shadow-lg cursor-pointer hover:bg-white transition-colors">
              <span className="text-xl">×</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
