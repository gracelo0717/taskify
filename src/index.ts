interface Task {
  id: number;
  text: string;
  completed: boolean;
}

let taskId = 0;
let tasks: Task[] = [];

const addTask = (text: string) => {
  const newTask: Task = {
    id: taskId++,
    text,
    completed: false,
  };
  tasks.push(newTask);
};
