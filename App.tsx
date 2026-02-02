import React, { useState, useEffect } from 'react';
import { Tab, DayPlan, Habit } from './types';
import { INITIAL_TASKS_TEMPLATE, INITIAL_HABITS, THEME_COLORS } from './constants';

// --- Icons (Minimalist Thin Stroke) ---
const CheckIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
  </svg>
);

// --- Helper Functions ---
const getWeekDays = (startDate: Date): { id: string, dateStr: string, fullDate: Date, dayNum: string }[] => {
  const days = [];
  const current = new Date(startDate);
  const dayOfWeek = current.getDay(); 
  const diff = current.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); 
  const monday = new Date(current.setDate(diff));

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      id: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][i],
      dateStr: d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
      dayNum: d.getDate().toString(),
      fullDate: d
    });
  }
  return days;
};

// --- Components ---

const WeeklyView = ({ 
  data, 
  onToggle, 
  onAdd, 
  onDelete 
}: { 
  data: (DayPlan & { dayNum?: string })[]; 
  onToggle: (dayId: string, taskId: string) => void;
  onAdd: (dayId: string, text: string) => void;
  onDelete: (dayId: string, taskId: string) => void;
}) => {
  return (
    <div className="w-full overflow-x-auto pb-12 pt-4 px-4 snap-x scroll-smooth">
      <div className="flex gap-6">
        {data.map((day, i) => {
          const theme = THEME_COLORS[day.color];
          const [newTask, setNewTask] = useState('');

          const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && newTask.trim()) {
              onAdd(day.id, newTask.trim());
              setNewTask('');
            }
          };

          const completedCount = day.tasks.filter(t => t.completed).length;
          const totalCount = day.tasks.length;
          
          return (
            <div 
              key={day.id} 
              className={`
                min-w-[320px] w-[340px] shrink-0 
                rounded-[2rem] border border-white/40
                bg-gradient-to-br ${theme.gradient}
                backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.03)]
                flex flex-col snap-center
                transition-all duration-500 hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.06)] hover:-translate-y-2
                group
              `}
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-3xl font-serif font-light ${theme.text} opacity-90 tracking-tight`}>{day.name}</span>
                  <div className="w-10 h-10 shrink-0 rounded-full bg-white/60 flex items-center justify-center backdrop-blur-md shadow-sm ml-2">
                    <span className="text-lg font-medium text-gray-800">{day.dayNum}</span>
                  </div>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">{day.date}</div>
                
                {/* Progress Ring Line */}
                <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${theme.accent} transition-all duration-1000 ease-out`} 
                    style={{ width: `${(completedCount / (totalCount || 1)) * 100}%` }} 
                  />
                </div>
              </div>

              {/* Task List */}
              <div className="flex-1 px-4 pb-4 overflow-y-auto min-h-[300px] max-h-[500px] custom-scrollbar space-y-3">
                {day.tasks.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-40">
                    <div className="w-1 h-1 bg-current rounded-full mb-2"></div>
                    <span className="text-sm font-light italic">Свободный день</span>
                  </div>
                )}
                {day.tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="group/task relative flex items-center gap-3 p-3.5 bg-white/60 hover:bg-white/90 rounded-2xl transition-all duration-300 shadow-sm border border-transparent hover:border-white/50"
                  >
                    <button
                      onClick={() => onToggle(day.id, task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-[1.5px] transition-all duration-300 flex items-center justify-center ${
                        task.completed 
                          ? 'border-transparent bg-gray-800 text-white scale-100' 
                          : 'border-gray-300 text-transparent hover:border-gray-500'
                      }`}
                    >
                      <CheckIcon />
                    </button>
                    
                    <span className={`flex-1 text-[15px] transition-all duration-300 ${
                      task.completed ? 'text-gray-400 line-through' : 'text-gray-800 font-medium'
                    }`}>
                      {task.text}
                    </span>

                    <button 
                      onClick={() => onDelete(day.id, task.id)}
                      className="opacity-0 group-hover/task:opacity-100 text-gray-300 hover:text-red-400 transition-all p-1"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 pt-0">
                <div className="relative overflow-hidden rounded-2xl bg-white/40 focus-within:bg-white/80 transition-colors border border-transparent focus-within:border-white/50">
                  <input
                    type="text"
                    placeholder="Новая задача..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-4 pr-10 py-4 text-sm bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-700"
                  />
                  <button 
                    onClick={() => {
                      if (newTask.trim()) {
                        onAdd(day.id, newTask.trim());
                        setNewTask('');
                      }
                    }}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-800 transition-colors"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HabitTracker = ({ 
  habits, 
  onToggle,
  onAddHabit,
  onDeleteHabit
}: { 
  habits: Habit[]; 
  onToggle: (habitId: string, date: number) => void;
  onAddHabit: (name: string) => void;
  onDeleteHabit: (id: string) => void;
}) => {
  const [newHabitName, setNewHabitName] = useState('');
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleAdd = () => {
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim());
      setNewHabitName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
           <h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-800 tracking-tight">Ритмы Жизни</h2>
           <p className="text-gray-500 mt-2 font-light text-lg">Визуализация вашей дисциплины</p>
        </div>
        
        {/* New Habit Input - Floating Style */}
        <div className="relative group">
          <input
            type="text"
            placeholder="Добавить трекер..."
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-64 bg-white/50 border border-white/60 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all backdrop-blur-sm"
          />
          <button 
            onClick={handleAdd}
            className="absolute right-2 top-2 p-1.5 bg-gray-900 text-white rounded-full hover:scale-110 transition-transform"
          >
            <PlusIcon />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[800px]">
          {/* Days Header */}
          <div className="grid grid-cols-[250px_1fr] gap-6 mb-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 self-end px-4">Привычка</div>
            <div className="flex justify-between px-2">
              {days.map(d => (
                <div key={d} className="w-6 text-center text-[10px] font-bold text-gray-300">
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {habits.map((habit) => {
              const completedCount = Object.values(habit.progress).filter(Boolean).length;
              const percent = Math.round((completedCount / days.length) * 100);
              
              return (
                <div 
                  key={habit.id} 
                  className="group grid grid-cols-[250px_1fr] gap-6 items-center p-4 rounded-2xl hover:bg-white/40 transition-colors border border-transparent hover:border-white/40 relative"
                >
                  <div className="flex justify-between items-center pr-4 relative">
                    <span className="font-medium text-gray-700 text-lg truncate max-w-[180px]" title={habit.name}>{habit.name}</span>
                    <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         onDeleteHabit(habit.id);
                       }}
                       className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all p-2 absolute right-0 z-10"
                       title="Удалить"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center bg-white/30 rounded-full p-2 backdrop-blur-sm border border-white/20">
                    {days.map(d => {
                      const isCompleted = !!habit.progress[d];
                      return (
                        <button
                          key={d}
                          onClick={() => onToggle(habit.id, d)}
                          className={`
                            w-5 h-5 rounded-full transition-all duration-500 ease-out relative
                            ${isCompleted ? 'bg-gray-800 scale-100' : 'bg-gray-200/50 scale-50 hover:scale-90 hover:bg-gray-300'}
                          `}
                        >
                          {isCompleted && <span className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ weekData, habits }: { weekData: DayPlan[], habits: Habit[] }) => {
  const totalTasks = weekData.reduce((acc, day) => acc + day.tasks.length, 0);
  const completedTasks = weekData.reduce((acc, day) => acc + day.tasks.filter(t => t.completed).length, 0);
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* Big Hero Stat - Bento Box 1 */}
      <div className="lg:col-span-8 glass-panel p-10 rounded-[3rem] relative overflow-hidden flex flex-col justify-center min-h-[400px]">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-gradient-to-tr from-blue-100 to-emerald-100 rounded-full blur-3xl opacity-40"></div>
        
        <div className="relative z-10">
          <h3 className="text-gray-500 font-medium uppercase tracking-widest text-sm mb-2">Общая продуктивность</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-[10rem] leading-none font-serif font-medium text-gray-800 tracking-tighter">{completionRate}</span>
            <span className="text-6xl font-serif text-gray-300">%</span>
          </div>
          <p className="text-xl text-gray-500 mt-6 max-w-md font-light">
             Вы выполнили <span className="text-gray-900 font-medium">{completedTasks}</span> из <span className="text-gray-900 font-medium">{totalTasks}</span> задач на этой неделе.
             {completionRate > 80 ? " Феноменальный результат." : " Продолжайте движение."}
          </p>
        </div>
      </div>

      {/* Habits Stat - Bento Box 2 */}
      <div className="lg:col-span-4 glass-panel p-8 rounded-[3rem] flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-200 to-gray-800"></div>
        <h3 className="text-2xl font-serif font-medium mb-8 mt-4">Привычки</h3>
        <div className="flex-1 space-y-6">
          {habits.slice(0, 4).map(habit => {
             const checks = Object.values(habit.progress).filter(Boolean).length;
             return (
               <div key={habit.id} className="group">
                 <div className="flex justify-between text-sm mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                   <span className="font-medium">{habit.name}</span>
                   <span>{checks}/30</span>
                 </div>
                 <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                   <div 
                      className="h-full bg-gray-800 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.min((checks / 30) * 100, 100)}%` }} 
                   />
                 </div>
               </div>
             )
          })}
        </div>
      </div>

      {/* Analytics Graph Placeholder - Bento Box 3 */}
      <div className="lg:col-span-12 glass-panel p-10 rounded-[3rem] flex items-center justify-between gap-10">
        <div className="flex-1 space-y-4">
          <div className="mb-6">
            <h3 className="text-3xl font-serif text-gray-800">Динамика потока</h3>
            <p className="text-gray-400 text-sm mt-1">Процент выполнения задач по дням недели</p>
          </div>
          
          <div className="flex items-end gap-3 h-40 w-full max-w-4xl pt-4 border-b border-gray-200">
             {weekData.map((day, i) => {
                const total = day.tasks.length;
                const done = day.tasks.filter(t => t.completed).length;
                const h = total ? (done / total) * 100 : 0;
                // Min height for visual if there are tasks but 0 done, or small height if empty
                const displayH = total === 0 ? 2 : (h === 0 ? 5 : h); 

                return (
                  <div key={i} className="flex-1 h-full flex items-end group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                      {done} из {total} ({Math.round(h)}%)
                    </div>
                    
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-500 relative overflow-hidden ${total === 0 ? 'bg-gray-100' : 'bg-gray-800/80 hover:bg-gray-800'}`} 
                      style={{ height: `${displayH}%` }}
                    >
                      {total > 0 && <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent"></div>}
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-400 group-hover:text-gray-800 transition-colors">
                      {day.name.slice(0,1)}
                    </div>
                  </div>
                )
             })}
          </div>
        </div>
        <div className="hidden lg:block w-64 text-right self-center">
           <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Фокус недели</div>
           <div className="text-2xl font-serif text-gray-800">Стабильность</div>
           <div className="mt-4 text-xs text-gray-400 max-w-[150px] ml-auto leading-relaxed">
             Наведите на столбцы графика, чтобы увидеть точное количество выполненных задач.
           </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.WEEKLY);
  const [ownerName, setOwnerName] = useState('Моники');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weekData, setWeekData] = useState<(DayPlan & { dayNum?: string })[]>([]);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);

  // Initialize Week Data
  useEffect(() => {
    const dates = getWeekDays(new Date(startDate));
    setWeekData(currentData => {
      if (currentData.length === 0) {
        return INITIAL_TASKS_TEMPLATE.map((tpl, index) => ({
          ...tpl,
          date: dates[index].dateStr,
          dayNum: dates[index].dayNum,
        } as DayPlan & { dayNum: string }));
      }
      return currentData.map((day, index) => ({
        ...day,
        date: dates[index].dateStr,
        dayNum: dates[index].dayNum
      }));
    });
  }, [startDate]);

  // Actions
  const toggleTask = (dayId: string, taskId: string) => {
    setWeekData(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        tasks: day.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      };
    }));
  };

  const addTask = (dayId: string, text: string) => {
    setWeekData(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        tasks: [...day.tasks, { id: Date.now().toString(), text, completed: false }]
      };
    }));
  };

  const deleteTask = (dayId: string, taskId: string) => {
    setWeekData(prev => prev.map(day => {
      if (day.id !== dayId) return day;
      return {
        ...day,
        tasks: day.tasks.filter(t => t.id !== taskId)
      };
    }));
  };

  const toggleHabit = (habitId: string, dayNumber: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      return { ...h, progress: { ...h.progress, [dayNumber]: !h.progress[dayNumber] } };
    }));
  };

  const addHabit = (name: string) => {
    setHabits(prev => [...prev, { id: `h-${Date.now()}`, name, progress: {} }]);
  };

  const deleteHabit = (id: string) => {
    // Removed confirm dialog for smoother UX
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const handleSync = () => {
    alert("Инициирована нейро-синхронизация с Google Calendar...");
  };

  return (
    <div className="min-h-screen p-6 md:p-12 font-sans text-gray-800 selection:bg-orange-100 selection:text-orange-900 relative">
      
      {/* Background Animated Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-100/30 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-emerald-100/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="max-w-[1800px] mx-auto mb-16 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          
          {/* Brand Area */}
          <div className="space-y-4">
             <div className="flex items-center gap-4">
               <div className="w-12 h-[1px] bg-gray-400"></div>
               <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Система 2026</span>
             </div>
             
             <div className="flex flex-col">
               <div className="flex items-baseline gap-4">
                 <h1 className="text-6xl md:text-8xl font-serif font-medium tracking-tight text-gray-900 leading-none">
                   Планер
                 </h1>
                 <span className="text-6xl md:text-8xl font-serif font-light text-gray-300 italic">
                   для
                 </span>
               </div>
               
               <div className="relative group w-max mt-2">
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="bg-transparent text-5xl md:text-7xl font-serif font-medium text-gray-800 focus:outline-none placeholder-gray-300 w-auto min-w-[300px]"
                    placeholder="Имя"
                  />
                  <div className="absolute bottom-2 left-0 w-full h-[2px] bg-gray-200 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
               </div>
             </div>
          </div>

          {/* Navigation Dock */}
          <div className="glass-panel p-2 rounded-full flex gap-1 shadow-2xl shadow-gray-200/50">
             {[
                { id: Tab.WEEKLY, label: 'Неделя' },
                { id: Tab.HABITS, label: 'Ритмы' },
                { id: Tab.DASHBOARD, label: 'Обзор' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-500 ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white shadow-lg scale-105'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
          </div>

          {/* Date & Sync - Minimal */}
          <div className="flex flex-col gap-2 items-end">
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-3 bg-white/40 px-5 py-2 rounded-full border border-white/60 hover:bg-white/80 transition-all">
                <CalendarIcon />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {new Date(startDate).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })}
                </span>
              </div>
              <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
            </div>
            
            <button 
              onClick={handleSync}
              className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-800 flex items-center gap-2 transition-colors py-2"
            >
              <GoogleIcon />
              Синхронизация
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto relative z-10 pb-20">
        <div className="transition-all duration-700 ease-out transform">
          {activeTab === Tab.WEEKLY && (
            <WeeklyView 
              data={weekData} 
              onToggle={toggleTask} 
              onAdd={addTask} 
              onDelete={deleteTask}
            />
          )}
          
          {activeTab === Tab.HABITS && (
            <HabitTracker 
              habits={habits} 
              onToggle={toggleHabit} 
              onAddHabit={addHabit}
              onDeleteHabit={deleteHabit}
            />
          )}

          {activeTab === Tab.DASHBOARD && (
            <Dashboard 
              weekData={weekData} 
              habits={habits} 
            />
          )}
        </div>
      </main>
    </div>
  );
}