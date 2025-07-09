// Task Logic from Index.ts without DOM
export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: undefined | 'Low' | 'Medium' | 'High';
  status: 'To-Do' | 'In-progress' | 'Done';
}

let taskId = 0;
export let tasks: Task[] = [];

// Add task
export const addTask = (
  text: string,
  priority: undefined | 'Low' | 'Medium' | 'High'
): Task => {
  const newTask: Task = {
    id: taskId++,
    text,
    completed: false,
    priority,
    status: 'To-Do',
  };
  tasks.push(newTask);
  return newTask;
};

// Completed task
export const completedTask = (id: number): void => {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.completed = !task.completed;
  }
};

// Filter task
export const getFilteredTasks = (
  filterPriority: '' | 'Low' | 'Medium' | 'High',
  filterStatus: '' | 'To-Do' | 'In-progress' | 'Done'
): Task[] => {
  return tasks.filter((task) => {
    const matchPriority = filterPriority
      ? task.priority === filterPriority
      : true;
    const matchStatus = filterStatus ? task.status === filterStatus : true;
    return matchPriority && matchStatus;
  });
};

// Prioritize
export const sortByPriority = (taskList: Task[]): Task[] => {
  const priorityOrder: Record<string, number> = {
    High: 1,
    Medium: 2,
    Low: 3,
    '': 4,
  };

  return taskList.sort((a, b) => {
    const aPriority = a.priority || '';
    const bPriority = b.priority || '';
    return priorityOrder[aPriority] - priorityOrder[bPriority];
  });
};
