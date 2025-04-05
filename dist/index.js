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
        if (priorityFilterDiv) {
            priorityFilterDiv.classList.remove('hidden');
        }
        const statusFilterDiv = document.querySelector('.status-filter');
        if (statusFilterDiv) {
            statusFilterDiv.classList.remove('hidden');
        }
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
    const taskList = document.getElementById('task-list');
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
            const taskId = e.target.dataset.id;
            const taskDiv = e.target.parentElement;
            if (taskDiv) {
                const label = taskDiv.querySelector('label');
                if (label) {
                    const taskToEdit = tasks.find((task) => task.id.toString() === taskId);
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
            const taskId = e.target.dataset.id;
            tasks = tasks.filter((task) => task.id !== parseInt(taskId));
            renderTask();
        });
        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(label);
        taskDiv.appendChild(priorityLabel);
        taskDiv.appendChild(statusLabel);
        taskDiv.appendChild(edit);
        taskDiv.appendChild(deleteBtn);
        taskList.appendChild(taskDiv);
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
