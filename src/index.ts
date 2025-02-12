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
  const taskList = document.getElementById('task-list') as HTMLDivElement;
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const taskDiv = document.createElement('div');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    const label = document.createElement('label');
    label.textContent = task.text;
    if (task.completed) {
      label.style.textDecoration = 'line-through';
    }
    checkbox.addEventListener('click', () => completedTask(task.id));

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(label);
    taskList.appendChild(taskDiv);
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
