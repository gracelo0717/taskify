"use strict";
let taskId = 0;
let tasks = [];
// function to add a new task
const addTask = (text) => {
    const newTask = {
        id: taskId++,
        text,
        completed: false,
    };
    tasks.push(newTask);
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
// function to render the task list in the UI
const renderTask = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
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
        // set attribute expects a string, not number
        edit.setAttribute('data-id', String(task.id));
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
        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(label);
        taskDiv.appendChild(edit);
        taskList.appendChild(taskDiv);
    });
};
// event listener for the "Add Task" button
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task-button');
addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        addTask(taskText);
        taskInput.value = '';
    }
    else {
        alert('Please enter a task');
    }
});
