// define interfaces and global variables
interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: undefined | 'Low' | 'Medium' | 'High';
  status: undefined | 'To-Do' | 'In-progress' | 'Done';
}

let taskId = 0;
let tasks: Task[] = [];
let filterPriority: '' | 'Low' | 'Medium' | 'High';
let filterStatus: '' | 'To-Do' | 'In-progress' | 'Done';

// function to add a new task
const addTask = (
  text: string,
  priority: undefined | 'Low' | 'Medium' | 'High'
) => {
  const newTask: Task = {
    id: taskId++,
    text,
    completed: false,
    priority,
    status: 'To-Do',
  };
  tasks.push(newTask);

  if (tasks.length === 1) {
    const priorityFilterDiv = document.querySelector(
      '.priority-filter'
    ) as HTMLDivElement;
    if (priorityFilterDiv) priorityFilterDiv.classList.remove('hidden');

    const statusFilterDiv = document.querySelector(
      '.status-filter'
    ) as HTMLDivElement;
    if (statusFilterDiv) statusFilterDiv.classList.remove('hidden');

    const taskColumns = document.getElementById('task-columns');
    if (taskColumns) taskColumns.classList.remove('hidden');
  }

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
  const todoList = document.getElementById('todo-list') as HTMLDivElement;
  const inProgressList = document.getElementById(
    'in-progress-list'
  ) as HTMLDivElement;
  const doneList = document.getElementById('done-list') as HTMLDivElement;

  todoList.innerHTML = '';
  inProgressList.innerHTML = '';
  doneList.innerHTML = '';

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

  todoList.appendChild(clearButton);

  // filter tasks based on the selected priority
  const filteredTasks = tasks.filter((task) => {
    const correctPriority = filterPriority
      ? task.priority === filterPriority
      : true;
    const correctStatus = filterStatus ? task.status === filterStatus : true;
    return correctPriority && correctStatus;
  });

  filteredTasks.forEach((task) => {
    const taskDiv = document.createElement('div');
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    label.textContent = task.text;

    // add priority to task
    const priorityLabel = document.createElement('span');
    priorityLabel.textContent = task.priority ? task.priority : 'No Priority';
    priorityLabel.classList.add('priority-label');

    // add status to task
    const statusLabel = document.createElement('span');
    statusLabel.textContent = task.status ? task.status : 'No Status';
    statusLabel.classList.add('status-label');

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
            const textInput = document.createElement('input');
            textInput.value = taskToEdit.text;

            const statusSelect = document.createElement('select');
            ['To-Do', 'In-progress', 'Done'].forEach((status) => {
              const option = document.createElement('option');
              option.value = status;
              option.textContent = status;
              if (status === taskToEdit.status) {
                option.selected = true;
              }
              statusSelect.appendChild(option);
            });

            // replace label with input and immediately focus on input field
            if (label && statusLabel) {
              taskDiv.replaceChild(textInput, label);
              taskDiv.replaceChild(statusSelect, statusLabel);
              textInput.focus();
            }

            // add event listener to save changes on enter
            textInput.addEventListener('keydown', (e) => {
              if (e.key === 'Enter') {
                taskToEdit.text = textInput.value;
                taskToEdit.status = statusSelect.value as
                  | 'To-Do'
                  | 'In-progress'
                  | 'Done';
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
    taskDiv.appendChild(priorityLabel);
    taskDiv.appendChild(statusLabel);
    taskDiv.appendChild(edit);
    taskDiv.appendChild(deleteBtn);

    if (task.status === 'To-Do') {
      todoList.appendChild(taskDiv);
    } else if (task.status === 'In-progress') {
      inProgressList.appendChild(taskDiv);
    } else if (task.status === 'Done') {
      doneList.appendChild(taskDiv);
    }
  });
};

// event listener for the "Add Task" button
const taskInput = document.getElementById('task-input') as HTMLInputElement;
const addTaskButton = document.getElementById(
  'add-task-button'
) as HTMLButtonElement;
const priorityOptions = document.getElementById(
  'priority-options'
) as HTMLSelectElement;

addTaskButton.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  const selectedPriority = priorityOptions.value as
    | undefined
    | 'Low'
    | 'Medium'
    | 'High';

  if (taskText) {
    addTask(taskText, selectedPriority);
    taskInput.value = '';
    priorityOptions.selectedIndex = 0;
  } else {
    alert('Please enter a task');
  }
});

// add event listener for priority filter
const priorityFilter = document.querySelector(
  '.priority-filter select'
) as HTMLSelectElement;

priorityFilter.addEventListener('change', (e) => {
  const selectedPriority = (e.target as HTMLSelectElement).value;
  filterPriority = selectedPriority as '' | 'Low' | 'Medium' | 'High';
  renderTask();
});

// add event listener for status filter
const statusFilter = document.querySelector(
  '.status-filter select'
) as HTMLSelectElement;

statusFilter.addEventListener('change', (e) => {
  const selectedStatus = (e.target as HTMLSelectElement).value;
  filterStatus = selectedStatus as '' | 'To-Do' | 'In-progress' | 'Done';
  renderTask();
});
