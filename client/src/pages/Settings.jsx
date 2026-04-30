import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Bell, Palette, Shield, Save, Eye, EyeOff, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskUpdates: true,
    projectInvites: true,
    weeklyDigest: false,
  });

  const handleProfileSave = () => {
    toast.success('Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPass.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    toast.success('Password changed successfully!');
    setPasswordForm({ current: '', newPass: '', confirm: '' });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="bg-white rounded-[24px] shadow-sm p-4">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-50 text-amber-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-white rounded-[24px] shadow-sm p-8">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <h2 className="text-lg font-bold text-slate-800">Profile Settings</h2>
              
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-amber-100 border-3 border-amber-500/20 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${user?.id || 'admin'}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-amber-600 transition-colors">
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-slate-800">{user?.name}</p>
                  <p className="text-sm text-slate-400">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-slate-50 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 border border-slate-200 focus:border-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full bg-slate-50 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 border border-slate-200 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleProfileSave}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all text-sm shadow-lg shadow-amber-500/20"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <h2 className="text-lg font-bold text-slate-800">Security Settings</h2>
              <div className="space-y-6 max-w-md">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.current}
                      onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                      className="w-full bg-slate-50 rounded-xl py-3 pl-11 pr-11 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 border border-slate-200 focus:border-amber-500"
                      placeholder="••••••••"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPass}
                    onChange={e => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                    className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 border border-slate-200 focus:border-amber-500"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Confirm Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 border border-slate-200 focus:border-amber-500"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all text-sm shadow-lg shadow-amber-500/20"
                >
                  <Lock size={16} /> Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <h2 className="text-lg font-bold text-slate-800">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                  { key: 'taskUpdates', label: 'Task Updates', desc: 'Notify when tasks are assigned or updated' },
                  { key: 'projectInvites', label: 'Project Invites', desc: 'Notify when added to a new project' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of activity' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.label}</p>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className={`w-12 h-7 rounded-full transition-all relative ${
                        notifications[item.key] ? 'bg-amber-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-all ${
                        notifications[item.key] ? 'left-6' : 'left-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <h2 className="text-lg font-bold text-slate-800">Appearance</h2>
              <div className="space-y-6">
                <p className="text-sm text-slate-500">Theme</p>
                <div className="grid grid-cols-3 gap-4">
                  {['Light', 'Dark', 'System'].map(theme => (
                    <button
                      key={theme}
                      className={`p-4 rounded-xl border-2 text-center font-bold text-sm transition-all ${
                        theme === 'Light'
                          ? 'border-amber-500 bg-amber-50 text-amber-600'
                          : 'border-slate-200 hover:border-slate-300 text-slate-500'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl mx-auto mb-2 ${
                        theme === 'Light' ? 'bg-white border border-slate-200' :
                        theme === 'Dark' ? 'bg-slate-800' : 'bg-gradient-to-br from-white to-slate-800'
                      }`} />
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
