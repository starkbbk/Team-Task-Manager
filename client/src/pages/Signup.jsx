import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
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
      toast.error(error.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-bg bg-mesh px-4">
      <div className="w-full max-w-md animate-fade-in py-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#ff7e1a] to-[#f0670d] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-500/30 active:scale-95 transition-transform duration-300">
            <span className="text-white font-bold text-2xl">TM</span>
          </div>
          <h1 className="text-4xl font-extrabold text-[#2d2d2d] mb-3 tracking-tight">Create account</h1>
          <p className="text-[#6b6b6b] text-lg font-medium">Start managing your team's tasks today</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#2d2d2d] mb-2.5 ml-1">Full Name</label>
              <div className="relative group">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#949494] group-focus-within:text-[#ff7e1a] transition-colors" />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-11"
                  placeholder="John Doe"
                  required
                  minLength={2}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2d2d2d] mb-2.5 ml-1">Email</label>
              <div className="relative group">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#949494] group-focus-within:text-[#ff7e1a] transition-colors" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2d2d2d] mb-2.5 ml-1">Password</label>
              <div className="relative group">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#949494] group-focus-within:text-[#ff7e1a] transition-colors" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11 pr-11"
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#949494] hover:text-[#2d2d2d] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-[#949494] mt-2 ml-1">Must be at least 8 characters</p>
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#6b6b6b] font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-[#ff7e1a] hover:text-[#f0670d] font-bold transition-colors ml-1">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
