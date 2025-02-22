// define interfaces and global variables
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

let taskId = 0;
let tasks: Task[] = [];

// function to add a new task
const addTask = (text: string) => {
  const newTask: Task = {
    id: taskId++,
    text,
    completed: false,
  };
  tasks.push(newTask);
  renderTask();
};

// function to toggle a completed task
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

  // add clear task button
  const clearButton = document.createElement('button');
  clearButton.innerText = 'Clear Tasks';
  clearButton.classList.add('clear-btn');

  // add event listener for clearButton to render only non-completed tasks
  clearButton.addEventListener('click', () => {
    // console.log('clearButton clicked');
    tasks = tasks.filter((task) => !task.completed);
    renderTask();
  });

  taskList.appendChild(clearButton);

  tasks.forEach((task) => {
    const taskDiv = document.createElement('div');
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    label.textContent = task.text;

    // add checkbox - check box and strikethrough when completed
    checkbox.checked = task.completed;
    checkbox.type = 'checkbox';
    if (task.completed) {
      label.style.textDecoration = 'line-through';
    }

    // add edit button
    const edit = document.createElement('button');
    edit.innerText = 'Edit';
    edit.setAttribute('data-id', String(task.id));
    edit.classList.add('edit-btn');

    // add event listener to checkbox
    checkbox.addEventListener('click', () => completedTask(task.id));

    // add event listener to edit button
    edit.addEventListener('click', (e) => {
      const taskId = (e.target as HTMLButtonElement).dataset.id;
      const taskDiv = (e.target as HTMLButtonElement).parentElement;

      if (taskDiv) {
        const label = taskDiv.querySelector('label');
        if (label) {
          const taskToEdit = tasks.find(
            (task) => task.id.toString() === taskId
          );
          if (taskToEdit) {
            const input = document.createElement('input');
            input.value = taskToEdit.text;

            // replace label with input and immediately focus on input field
            taskDiv.replaceChild(input, label);
            input.focus();

            // add event listener to save changes on enter
            input.addEventListener('keydown', (e) => {
              if (e.key === 'Enter') {
                taskToEdit.text = input.value;
                renderTask();
              }
            });
          }
        }
      }
    });

    // add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.setAttribute('data-id', String(task.id));
    deleteBtn.classList.add('delete-btn');

    // add event listener to delete button
    deleteBtn.addEventListener('click', (e) => {
      const taskId = (e.target as HTMLButtonElement).dataset.id;
      tasks = tasks.filter((task) => task.id !== parseInt(taskId!));
      renderTask();
    });

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(label);
    taskDiv.appendChild(edit);
    taskDiv.appendChild(deleteBtn);
    taskList.appendChild(taskDiv);
  });
};

// event listener for the "Add Task" button
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
