import { useState, useRef, useEffect } from 'react';
import { Send, Search, Phone, Video, MoreVertical, Smile, Paperclip, Image } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(0);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({
    0: [
      { id: 1, sender: 'Alex Morgan', text: 'Hey! Have you checked the latest sprint board?', time: '10:30 AM', isMe: false },
      { id: 2, sender: 'Me', text: 'Yes! The progress looks great. We\'re on track for the deadline.', time: '10:32 AM', isMe: true },
      { id: 3, sender: 'Alex Morgan', text: 'Perfect! Let me know if you need help with the API integration.', time: '10:33 AM', isMe: false },
      { id: 4, sender: 'Me', text: 'Will do! Thanks for the offer 👍', time: '10:35 AM', isMe: true },
    ],
    1: [
      { id: 1, sender: 'Design Team', text: 'New mockups are ready for review! 🎨', time: '9:00 AM', isMe: false },
      { id: 2, sender: 'Me', text: 'Looking at them now, great work!', time: '9:15 AM', isMe: true },
    ],
    2: [
      { id: 1, sender: 'Priya Sharma', text: 'Can you review the PR I just pushed?', time: 'Yesterday', isMe: false },
    ],
  });
  const messagesEndRef = useRef(null);

  const contacts = [
    { id: 0, name: 'Alex Morgan', avatar: 'https://i.pravatar.cc/100?u=30', status: 'online', lastMsg: 'Will do! Thanks for the offer 👍' },
    { id: 1, name: 'Design Team', avatar: 'https://i.pravatar.cc/100?u=31', status: 'online', lastMsg: 'New mockups are ready for review! 🎨', isGroup: true },
    { id: 2, name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/100?u=32', status: 'away', lastMsg: 'Can you review the PR I just pushed?' },
    { id: 3, name: 'Daniel Lee', avatar: 'https://i.pravatar.cc/100?u=33', status: 'offline', lastMsg: 'See you tomorrow!' },
    { id: 4, name: 'Frontend Team', avatar: 'https://i.pravatar.cc/100?u=34', status: 'online', lastMsg: 'Bug fix deployed ✅', isGroup: true },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChat]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'Me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    setChatMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMsg],
    }));
    setMessage('');
  };

  const statusColors = { online: 'bg-emerald-500', away: 'bg-amber-500', offline: 'bg-slate-300' };
  const activeContact = contacts[activeChat];
  const currentMessages = chatMessages[activeChat] || [];

  return (
    <div className="animate-fade-in h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Chat</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-3rem)]">
        {/* Contact List */}
        <div className="bg-white rounded-[24px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search chats..." className="w-full bg-slate-50 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-amber-500/20" />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setActiveChat(contact.id)}
                className={`p-4 cursor-pointer transition-all flex items-center gap-3 ${
                  activeChat === contact.id ? 'bg-amber-50/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative">
                  <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full" />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${statusColors[contact.status]} rounded-full border-2 border-white`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{contact.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{contact.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-3 bg-white rounded-[24px] shadow-sm flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full" />
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusColors[activeContact.status]} rounded-full border-2 border-white`} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">{activeContact.name}</p>
                <p className="text-[10px] text-emerald-500 font-semibold capitalize">{activeContact.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-full transition-colors">
                <Phone size={18} />
              </button>
              <button className="p-2.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-full transition-colors">
                <Video size={18} />
              </button>
              <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {currentMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm ${
                  msg.isMe
                    ? 'bg-amber-500 text-white rounded-br-md'
                    : 'bg-white text-slate-700 shadow-sm rounded-bl-md'
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.isMe ? 'text-white/60' : 'text-slate-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-amber-500 transition-colors">
                <Smile size={20} />
              </button>
              <button className="p-2 text-slate-400 hover:text-amber-500 transition-colors">
                <Paperclip size={20} />
              </button>
              <button className="p-2 text-slate-400 hover:text-amber-500 transition-colors">
                <Image size={20} />
              </button>
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                onClick={sendMessage}
                className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-xl transition-colors shadow-lg shadow-amber-500/20"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
