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
  renderTask();
};

const completedTask = (id: number) => {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.completed = !task.completed;
  }
  renderTask();
};

const renderTask = () => {
  const taskList = document.getElementById('task-list') as HTMLUListElement;
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.completed) {
      li.style.textDecoration = 'line-through';
    }
    li.addEventListener('click', () => {
      completedTask(task.id);
    });
    taskList.appendChild(li);
  });
};

const taskInput = document.getElementById('task-input') as HTMLInputElement;
const addTaskButton = document.getElementById(
  'add-task-button'
) as HTMLButtonElement;

addTaskButton.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    addTask(taskText);
    taskInput.value = '';
  } else {
    alert('Please enter a task');
  }
});
