import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Mock events
  const events = {
    5: [{ title: 'Sprint Review', time: '10:00 AM', color: 'bg-blue-500' }],
    8: [{ title: 'Team Standup', time: '9:00 AM', color: 'bg-amber-500' }, { title: 'Design Review', time: '2:00 PM', color: 'bg-pink-500' }],
    12: [{ title: 'Client Meeting', time: '11:00 AM', color: 'bg-emerald-500' }],
    15: [{ title: 'Deadline: Phase 1', time: 'All Day', color: 'bg-red-500' }],
    20: [{ title: 'Workshop', time: '3:00 PM', color: 'bg-purple-500' }],
    25: [{ title: 'Release Day', time: 'All Day', color: 'bg-blue-500' }],
  };

  const today = new Date();
  const isToday = (day) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Calendar</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your schedule</p>
        </div>
        <button className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all text-sm shadow-lg shadow-amber-500/20">
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-white rounded-[24px] shadow-sm p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <ChevronLeft size={20} className="text-slate-500" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-1.5 text-xs font-bold text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
              >
                Today
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <ChevronRight size={20} className="text-slate-500" />
              </button>
            </div>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = events[day] || [];
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square p-1.5 rounded-xl cursor-pointer transition-all relative group ${
                    isToday(day)
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                      : selectedDay === day
                      ? 'bg-amber-50 text-amber-700'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-sm font-bold">{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {dayEvents.map((e, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${isToday(day) ? 'bg-white' : e.color}`} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-[24px] shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {Object.entries(events).map(([day, evts]) =>
              evts.map((evt, idx) => (
                <div key={`${day}-${idx}`} className="p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${evt.color}`} />
                    <p className="text-sm font-bold text-slate-800">{evt.title}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock size={10} />
                    <span>{monthNames[month]} {day} · {evt.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
