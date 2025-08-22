const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const taskList = document.getElementById("tasklist");
const searchTask = document.getElementById("searchTask");

const totalEl = document.querySelector(".titlenya-value");
const completedEl = document.querySelector(".titlenya-done");
const pendingEl = document.querySelector(".titlenya-wait");
const progressEl = document.querySelector(".titlenya-otw");

const deleteAllBtn = document.querySelector(".delete");

let tasks = [];


function addTask() {
    const taskText = taskInput.value.trim();
    const taskDate = dateInput.value;

    if (taskText === "" && taskDate === "") {
        alert("Please enter a task and date!");
        return;
    }

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    if(taskDate === "") {
        alert("please enter a date!");
        return;
    }


    const newTask = {
        id: Date.now(),
        text: taskText,
        date: taskDate || "No date",
        completed: false
    };

    tasks.push(newTask);
    renderTasks();
    taskInput.value = "";
    dateInput.value = "";
}


function renderTasks(filter = "") {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(filter.toLowerCase())
    );

    filteredTasks.forEach(task => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.text}</td>
            <td>${task.date}</td>
            <td>${task.completed ? "✅ Done" : "⏳ Pending"}</td>
            <td>
                <button onclick="toggleTask(${task.id})">Toggle</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;

        taskList.appendChild(row);
    });

    updateStats();
}


function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks(searchTask.value);
    }
}


function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks(searchTask.value);
}

deleteAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
        tasks = [];
        renderTasks();
    }
});


searchTask.addEventListener("input", (e) => {
    renderTasks(e.target.value);
});


function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    totalEl.textContent = total;
    completedEl.textContent = completed;
    pendingEl.textContent = pending;
    progressEl.textContent = progress + "%";

    document.querySelector(".progress").style.width = progress + "%";
}


const filterSelect = document.getElementById("filter");

function renderTasks(filter = "all", search = "") {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(search.toLowerCase())
    );

    if (filter === "completed") {
        filteredTasks = filteredTasks.filter(t => t.completed);
    } else if (filter === "pending") {
        filteredTasks = filteredTasks.filter(t => !t.completed);
    }

    filteredTasks.forEach(task => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.text}</td>
            <td>${task.date}</td>
            <td class="${task.completed ? "done" : "pending"}">
                ${task.completed ? "✅ Done" : "⏳ Pending"}
            </td>
            <td>
                <button onclick="toggleTask(${task.id})">Toggle</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;

        taskList.appendChild(row);
    });

    updateStats();
}

filterSelect.addEventListener("change", () => {
    renderTasks(filterSelect.value, searchTask.value);
});

searchTask.addEventListener("input", (e) => {
    renderTasks(filterSelect.value, e.target.value);
});

