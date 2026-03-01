const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".filter");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks
        .filter(task => {
            if (currentFilter === "completed") return task.completed;
            if (currentFilter === "pending") return !task.completed;
            return true;
        })
        .forEach((task, index) => {

            const li = document.createElement("li");
            li.className = "task";
            if (task.completed) li.classList.add("completed");

            const info = document.createElement("div");
            info.innerHTML = `<strong>${task.text}</strong>
                              <span>Due: ${task.date || "No date"}</span>`;

            const actions = document.createElement("div");
            actions.className = "actions";

            const completeBtn = document.createElement("button");
            completeBtn.textContent = "✔";
            completeBtn.className = "completeBtn";
            completeBtn.onclick = () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            };

            const editBtn = document.createElement("button");
            editBtn.textContent = "✏";
            editBtn.className = "editBtn";
            editBtn.onclick = () => {
                const newText = prompt("Edit task:", task.text);
                if (newText) {
                    tasks[index].text = newText;
                    saveTasks();
                    renderTasks();
                }
            };

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑";
            deleteBtn.className = "deleteBtn";
            deleteBtn.onclick = () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            };

            actions.append(completeBtn, editBtn, deleteBtn);
            li.append(info, actions);
            taskList.appendChild(li);
        });
}

addTaskBtn.onclick = () => {
    if (taskInput.value.trim() === "") return;

    tasks.push({
        text: taskInput.value,
        date: dueDateInput.value,
        completed: false
    });

    taskInput.value = "";
    dueDateInput.value = "";
    saveTasks();
    renderTasks();
};

filters.forEach(btn => {
    btn.onclick = () => {
        document.querySelector(".filter.active").classList.remove("active");
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
    };
});

themeToggle.onclick = () => {
    document.body.classList.toggle("light");
};

function checkReminders() {
    const today = new Date().toISOString().split("T")[0];
    tasks.forEach(task => {
        if (task.date === today && !task.completed) {
            alert(`Reminder: ${task.text} is due today!`);
        }
    });
}

checkReminders();
renderTasks();
