import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Shield, Users, CheckCircle, Rocket } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password, role);
      setSuccess(true);
      toast.success('Account created successfully!');
      setTimeout(() => {
        nav('/dashboard');
      }, 1800);
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.error || 'Signup failed.');
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#e2e8f0] flex items-center justify-center p-4 md:p-8 transition-all duration-700 ${success ? 'bg-slate-900' : ''}`}>
      <div className={`bg-[#f5f2eb] w-full max-w-6xl min-h-[700px] rounded-[40px] shadow-2xl flex overflow-hidden border-[12px] border-white/30 backdrop-blur-sm transition-all duration-700 ease-in-out ${success ? 'scale-[0.85] opacity-0 rounded-[80px] rotate-1' : 'scale-100 opacity-100'}`}>
        
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">

          <div className="max-w-md mx-auto w-full">
            {/* Logo */}
            <div className={`inline-flex items-center gap-2 px-5 py-2 bg-white rounded-full border border-slate-200 shadow-sm mb-6 transition-all duration-500 ${success ? 'scale-0' : ''}`}>
              <div className="w-5 h-5 bg-amber-500 rounded-full"></div>
              <span className="font-semibold text-sm text-slate-700">Team Task Manager</span>
            </div>

            {success ? (
              <div className="flex flex-col items-center justify-center py-16" style={{animation: 'successIn 0.6s ease-out forwards'}}>
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30" style={{animation: 'checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both'}}>
                  <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Account Created!</h2>
                <div className="flex items-center gap-2 text-amber-600">
                  <Rocket size={16} className="animate-bounce" />
                  <p className="text-sm font-medium">Redirecting to dashboard...</p>
                </div>
                <div className="flex gap-1.5 mt-6">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2.5 h-2.5 bg-amber-500 rounded-full" style={{animation: `dotPulse 1.2s ease-in-out ${i*0.2}s infinite`}} />
                  ))}
                </div>
              </div>
            ) : (
            <>
            <h1 className="text-4xl font-semibold text-slate-800 mb-2">Create an account</h1>
            <p className="text-slate-500 mb-8">Join your team and start managing tasks</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 ml-5 uppercase tracking-wider">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border-none rounded-full px-6 py-4 text-slate-700 shadow-inner focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 ml-5 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border-none rounded-full px-6 py-4 text-slate-700 shadow-inner focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 ml-5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border-none rounded-full px-6 py-4 text-slate-700 shadow-inner focus:ring-2 focus:ring-amber-500/20 transition-all outline-none pr-12"
                    placeholder="Min 8 characters"
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

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 ml-5 uppercase tracking-wider">Select your role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('ADMIN')}
                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${
                      role === 'ADMIN'
                        ? 'border-amber-500 bg-amber-50 shadow-lg shadow-amber-500/10'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      role === 'ADMIN' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'
                    } transition-colors`}>
                      <Shield size={18} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-bold ${role === 'ADMIN' ? 'text-amber-700' : 'text-slate-600'}`}>Admin</p>
                      <p className="text-[10px] text-slate-400">Manage team & tasks</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('MEMBER')}
                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${
                      role === 'MEMBER'
                        ? 'border-amber-500 bg-amber-50 shadow-lg shadow-amber-500/10'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      role === 'MEMBER' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'
                    } transition-colors`}>
                      <Users size={18} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-bold ${role === 'MEMBER' ? 'text-amber-700' : 'text-slate-600'}`}>Member</p>
                      <p className="text-[10px] text-slate-400">View & update tasks</p>
                    </div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#fcd34d] hover:bg-[#fbbf24] text-slate-800 font-bold py-4 rounded-full transition-all duration-300 shadow-lg shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50 text-lg"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <p className="text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-slate-800 font-bold border-b border-slate-800 pb-0.5">
                  Sign in
                </Link>
              </p>
            </div>
            </>
            )}
          </div>
        </div>

        {/* Right Side: Hero Image */}
        <div className="hidden lg:block lg:w-1/2 p-6">
          <div className={`relative h-full w-full rounded-[32px] overflow-hidden transition-all duration-700 ${success ? 'scale-105 opacity-60' : ''}`}>
            <img 
              src="/hero.png" 
              alt="Team collaborating" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10"></div>
            
            {/* Floating Widgets */}
            <div className={`absolute top-10 left-10 bg-amber-300/90 backdrop-blur px-6 py-4 rounded-2xl shadow-xl transition-all duration-500 ${success ? 'translate-y-[-40px] opacity-0' : ''}`}>
               <p className="text-xs font-bold text-slate-800 mb-1">Task Review With Team</p>
               <p className="text-[10px] text-slate-600">09:30am - 10:00am</p>
            </div>

            <div className={`absolute bottom-20 left-10 bg-white/90 backdrop-blur px-8 py-6 rounded-3xl shadow-2xl max-w-[280px] transition-all duration-500 delay-100 ${success ? 'translate-y-[40px] opacity-0' : ''}`}>
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

            <div className={`absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-800 shadow-lg cursor-pointer hover:bg-white transition-all duration-500 ${success ? 'scale-0' : ''}`}>
              <span className="text-xl">×</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes successIn {
          0% { opacity: 0; transform: scale(0.5); }
          60% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes checkPop {
          0% { transform: scale(0) rotate(-45deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default Signup;
