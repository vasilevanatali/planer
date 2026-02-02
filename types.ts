export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface DayPlan {
  id: string;
  name: string; // "Monday", "Tuesday", etc.
  date: string; // "24.11.2025"
  tasks: Task[];
  color: string; // Tailwind class prefix e.g., "blue"
}

export interface Habit {
  id: string;
  name: string;
  // Map of date string (DD-MM) to boolean
  progress: Record<number, boolean>;
}

export enum Tab {
  WEEKLY = 'Weekly Planner',
  HABITS = 'Habit Tracker',
  DASHBOARD = 'Dashboard',
}
