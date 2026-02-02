import { DayPlan, Habit } from './types';

// Aesthetic 2026: Nature Tech Palette
export const THEME_COLORS: Record<string, { bg: string; header: string; text: string; border: string; ring: string; accent: string; gradient: string }> = {
  blue: { // "Air"
    bg: 'bg-slate-50/50', 
    header: 'bg-slate-100/50', 
    text: 'text-slate-600', 
    border: 'border-white', 
    ring: 'focus:ring-slate-200', 
    accent: 'bg-slate-800',
    gradient: 'from-slate-100 to-slate-50'
  },
  red: { // "Clay"
    bg: 'bg-orange-50/50', 
    header: 'bg-orange-100/30', 
    text: 'text-stone-600', 
    border: 'border-white', 
    ring: 'focus:ring-orange-200', 
    accent: 'bg-orange-900',
    gradient: 'from-orange-50 to-stone-50'
  },
  green: { // "Sage"
    bg: 'bg-emerald-50/30', 
    header: 'bg-emerald-100/30', 
    text: 'text-emerald-800', 
    border: 'border-white', 
    ring: 'focus:ring-emerald-200', 
    accent: 'bg-emerald-900',
    gradient: 'from-emerald-50 to-teal-50'
  },
  orange: { // "Sand"
    bg: 'bg-amber-50/30', 
    header: 'bg-amber-100/30', 
    text: 'text-amber-900', 
    border: 'border-white', 
    ring: 'focus:ring-amber-200', 
    accent: 'bg-amber-800',
    gradient: 'from-amber-50 to-orange-50'
  },
  purple: { // "Mist"
    bg: 'bg-violet-50/30', 
    header: 'bg-violet-100/30', 
    text: 'text-violet-900', 
    border: 'border-white', 
    ring: 'focus:ring-violet-200', 
    accent: 'bg-violet-900',
    gradient: 'from-violet-50 to-purple-50'
  },
  indigo: { // "Deep Water"
    bg: 'bg-indigo-50/30', 
    header: 'bg-indigo-100/30', 
    text: 'text-indigo-900', 
    border: 'border-white', 
    ring: 'focus:ring-indigo-200', 
    accent: 'bg-indigo-900',
    gradient: 'from-indigo-50 to-blue-50'
  },
  gray: { // "Stone"
    bg: 'bg-stone-50/50', 
    header: 'bg-stone-100/50', 
    text: 'text-stone-600', 
    border: 'border-white', 
    ring: 'focus:ring-stone-200', 
    accent: 'bg-stone-800',
    gradient: 'from-stone-50 to-gray-50'
  },
};

export const INITIAL_TASKS_TEMPLATE: Partial<DayPlan>[] = [
  { id: 'mon', name: 'Понедельник', color: 'gray', tasks: [
    { id: '1', text: 'Стратегическая сессия', completed: true },
    { id: '2', text: 'Анализ метрик', completed: false }
  ]},
  { id: 'tue', name: 'Вторник', color: 'gray', tasks: [] },
  { id: 'wed', name: 'Среда', color: 'gray', tasks: [] },
  { id: 'thu', name: 'Четверг', color: 'gray', tasks: [] },
  { id: 'fri', name: 'Пятница', color: 'gray', tasks: [] },
  { id: 'sat', name: 'Суббота', color: 'red', tasks: [{ id: '3', text: 'Ресторан "Облака"', completed: false }] },
  { id: 'sun', name: 'Воскресенье', color: 'red', tasks: [] },
];

export const INITIAL_HABITS: Habit[] = [
  { 
    id: 'h1', 
    name: 'Гидратация (2л)', 
    progress: { 1: true, 2: true, 3: false, 4: true, 5: true } 
  },
  { 
    id: 'h2', 
    name: 'Глубокое чтение', 
    progress: { 1: true, 2: false, 3: true, 4: true, 5: false } 
  },
  { 
    id: 'h3', 
    name: 'Медитация', 
    progress: { 1: false, 2: true, 3: true, 4: true, 5: true } 
  },
  { 
    id: 'h4', 
    name: 'Дофаминовый детокс', 
    progress: { 1: true, 2: true, 3: true, 4: true, 5: true } 
  },
];