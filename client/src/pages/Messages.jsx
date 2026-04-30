import { useState } from 'react';
import { Mail, Send, Search, Star, Trash2, Archive, Clock, Paperclip, MoreVertical } from 'lucide-react';

const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState(0);
  const [replyText, setReplyText] = useState('');

  const messages = [
    { id: 1, from: 'Sarah Wilson', email: 'sarah@company.com', subject: 'Project Update - Q2 Goals', preview: 'Hey! Just wanted to share the latest updates on our Q2 goals. The team has been making great progress...', time: '10:30 AM', unread: true, starred: true, avatar: 'https://i.pravatar.cc/100?u=20' },
    { id: 2, from: 'Mike Chen', email: 'mike@company.com', subject: 'Design Review Meeting', preview: 'Can we schedule a design review for the new dashboard? I have some ideas I\'d like to discuss with the team...', time: '9:15 AM', unread: true, starred: false, avatar: 'https://i.pravatar.cc/100?u=21' },
    { id: 3, from: 'Emily Davis', email: 'emily@company.com', subject: 'Sprint Retrospective Notes', preview: 'Here are the notes from yesterday\'s sprint retrospective. Overall, the team felt positive about...', time: 'Yesterday', unread: false, starred: false, avatar: 'https://i.pravatar.cc/100?u=22' },
    { id: 4, from: 'James Brown', email: 'james@company.com', subject: 'New Feature Request', preview: 'I\'ve been getting feedback from users about a new feature. They want the ability to drag and drop tasks...', time: 'Yesterday', unread: false, starred: true, avatar: 'https://i.pravatar.cc/100?u=23' },
    { id: 5, from: 'Lisa Park', email: 'lisa@company.com', subject: 'Team Lunch Friday', preview: 'Hey everyone! Let\'s plan a team lunch this Friday to celebrate hitting our milestone. Any preferences?', time: 'Mon', unread: false, starred: false, avatar: 'https://i.pravatar.cc/100?u=24' },
  ];

  const selected = messages[selectedMessage];

  return (
    <div className="animate-fade-in h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
          <p className="text-slate-400 text-sm mt-1">{messages.filter(m => m.unread).length} unread messages</p>
        </div>
        <button className="bg-[#00a3ff] hover:bg-[#0088d6] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all text-sm shadow-lg shadow-blue-500/20">
          <Mail size={16} /> Compose
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Message List */}
        <div className="bg-white rounded-[24px] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search messages..." className="w-full bg-slate-50 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-amber-500/20" />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-18rem)]">
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(idx)}
                className={`p-4 cursor-pointer transition-all border-l-4 ${
                  selectedMessage === idx
                    ? 'bg-amber-50/50 border-amber-500'
                    : msg.unread
                    ? 'bg-blue-50/30 border-transparent hover:bg-slate-50'
                    : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img src={msg.avatar} alt={msg.from} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${msg.unread ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{msg.from}</p>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">{msg.time}</span>
                    </div>
                    <p className={`text-xs ${msg.unread ? 'font-semibold text-slate-700' : 'text-slate-500'} truncate`}>{msg.subject}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{msg.preview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-white rounded-[24px] shadow-sm flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <img src={selected.avatar} alt={selected.from} className="w-12 h-12 rounded-full" />
                    <div>
                      <h3 className="font-bold text-slate-800">{selected.from}</h3>
                      <p className="text-xs text-slate-400">{selected.email}</p>
                      <p className="text-sm font-semibold text-slate-700 mt-2">{selected.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                      <Star size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <Archive size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-6">
                  <Clock size={12} /> {selected.time}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selected.preview} This is a placeholder for the full message content. In a production environment, this would contain the complete email body with rich text formatting, attachments, and other media.
                </p>
                <div className="mt-8 p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 font-semibold mb-2">ATTACHMENTS (2)</p>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600">
                      <Paperclip size={12} /> report.pdf
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600">
                      <Paperclip size={12} /> screenshot.png
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 bg-slate-50 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <button className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-xl transition-colors shadow-lg shadow-amber-500/20">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
