"use strict";
let taskId = 0;
let tasks = [];
let filterPriority;
let filterStatus;
// function to add a new task
const addTask = (text, priority) => {
    const newTask = {
        id: taskId++,
        text,
        completed: false,
        priority,
        status: 'To-Do',
    };
    tasks.push(newTask);
    if (tasks.length === 1) {
        const priorityFilterDiv = document.querySelector('.priority-filter');
        if (priorityFilterDiv)
            priorityFilterDiv.classList.remove('hidden');
        const statusFilterDiv = document.querySelector('.status-filter');
        if (statusFilterDiv)
            statusFilterDiv.classList.remove('hidden');
        const taskColumns = document.getElementById('task-columns');
        if (taskColumns)
            taskColumns.classList.remove('hidden');
    }
    renderTask();
};
// function to toggle a completed task
const completedTask = (id) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
        task.completed = !task.completed;
    }
    renderTask();
};
const renderTask = () => {
    const todoList = document.getElementById('todo-list');
    const inProgressList = document.getElementById('in-progress-list');
    const doneList = document.getElementById('done-list');
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
    const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
        '': 4,
    };
    filteredTasks.sort((a, b) => {
        const aPriority = a.priority || '';
        const bPriority = b.priority || '';
        return priorityOrder[aPriority] - priorityOrder[bPriority];
    });
    filteredTasks.forEach((task) => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task-item');
        const checkbox = document.createElement('input');
        const label = document.createElement('label');
        label.textContent = task.text;
        // add priority to task
        const priorityLabel = document.createElement('span');
        priorityLabel.textContent = task.priority ? task.priority : 'No Priority';
        priorityLabel.classList.add('priority-label', 'priority-dot');
        if (task.priority === 'High') {
            priorityLabel.classList.add('priority-high');
        }
        else if (task.priority === 'Medium') {
            priorityLabel.classList.add('priority-medium');
        }
        else if (task.priority === 'Low') {
            priorityLabel.classList.add('priority-low');
        }
        else {
            priorityLabel.style.display = 'none';
        }
        // add status to task
        let statusLabel = null;
        if (task.status !== 'To-Do') {
            statusLabel = document.createElement('span');
            statusLabel.textContent = task.status;
            statusLabel.classList.add('status-label');
        }
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
            const taskId = e.target.dataset.id;
            const taskDiv = e.target.parentElement;
            if (taskDiv) {
                const label = taskDiv.querySelector('label');
                if (label) {
                    const taskToEdit = tasks.find((task) => task.id.toString() === taskId);
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
                                taskToEdit.status = statusSelect.value;
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
            const taskId = e.target.dataset.id;
            tasks = tasks.filter((task) => task.id !== parseInt(taskId));
            renderTask();
        });
        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(label);
        taskDiv.appendChild(priorityLabel);
        if (statusLabel) {
            taskDiv.appendChild(statusLabel);
        }
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('task-actions');
        buttonContainer.appendChild(edit);
        buttonContainer.appendChild(deleteBtn);
        taskDiv.appendChild(buttonContainer);
        // draggable status feature
        taskDiv.setAttribute('draggable', 'true');
        taskDiv.setAttribute('data-id', task.id.toString());
        taskDiv.addEventListener('dragstart', (e) => {
            var _a;
            (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', task.id.toString());
        });
        if (task.status === 'To-Do') {
            todoList.appendChild(taskDiv);
        }
        else if (task.status === 'In-progress') {
            inProgressList.appendChild(taskDiv);
        }
        else if (task.status === 'Done') {
            doneList.appendChild(taskDiv);
        }
    });
};
// event listener for the "Add Task" button
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task-button');
const priorityOptions = document.getElementById('priority-options');
addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const selectedPriority = priorityOptions.value;
    if (taskText) {
        addTask(taskText, selectedPriority);
        taskInput.value = '';
        priorityOptions.selectedIndex = 0;
    }
    else {
        alert('Please enter a task');
    }
});
// add event listener for priority filter
const priorityFilter = document.querySelector('.priority-filter select');
priorityFilter.addEventListener('change', (e) => {
    const selectedPriority = e.target.value;
    filterPriority = selectedPriority;
    renderTask();
});
// add event listener for status filter
const statusFilter = document.querySelector('.status-filter select');
statusFilter.addEventListener('change', (e) => {
    const selectedStatus = e.target.value;
    filterStatus = selectedStatus;
    renderTask();
});
const dropFeature = () => {
    const columns = [
        { elementId: 'todo-list', status: 'To-Do' },
        { elementId: 'in-progress-list', status: 'In-progress' },
        { elementId: 'done-list', status: 'Done' },
    ];
    columns.forEach(({ elementId, status }) => {
        const column = document.getElementById(elementId);
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            column.classList.add('drag-over');
        });
        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });
        // update status on drop
        column.addEventListener('drop', (e) => {
            var _a;
            e.preventDefault();
            column.classList.remove('drag-over');
            const taskId = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain');
            const task = tasks.find((t) => t.id === parseInt(taskId || ''));
            if (task) {
                task.status = status;
                renderTask();
            }
        });
    });
};
dropFeature();
