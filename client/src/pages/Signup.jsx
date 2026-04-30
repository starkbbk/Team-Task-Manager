import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, Apple, Chrome } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.error || 'Signup failed. Check console for details.');
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
              <span className="font-semibold text-slate-700">Team Task Manager</span>
            </div>
          </div>

          <div className="max-w-md mx-auto w-full">
            <h1 className="text-4xl font-semibold text-slate-800 mb-2">Create an account</h1>
            <p className="text-slate-500 mb-10">Sign up and get 30 day free trial</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 ml-5 uppercase tracking-wider">Full name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border-none rounded-full px-6 py-4 text-slate-700 shadow-inner focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                    placeholder="Amélie Laurent"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 ml-5 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-none rounded-full px-6 py-4 text-slate-700 shadow-inner focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                    placeholder="amelielaurent7622@gmail.com"
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
                    placeholder="••••••••••••••••"
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
                Have any account?{' '}
                <Link to="/login" className="text-slate-800 font-bold border-b border-slate-800 pb-0.5">
                  Sign in
                </Link>
              </p>
              <Link to="#" className="text-slate-500 border-b border-slate-300 pb-0.5">
                Terms & Conditions
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
               <p className="text-xs font-bold text-slate-800 mb-1">Task Review With Team</p>
               <p className="text-[10px] text-slate-600">09:30am - 10:00am</p>
            </div>

            <div className="absolute bottom-20 left-10 bg-white/90 backdrop-blur px-8 py-6 rounded-3xl shadow-2xl max-w-[280px]">
               <div className="flex justify-between items-center mb-4">
                 <p className="font-bold text-slate-800">Daily Meeting</p>
                 <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
               </div>
               <p className="text-xs text-slate-500 mb-4">12:00pm - 01:00pm</p>
               <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
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

export default Signup;
