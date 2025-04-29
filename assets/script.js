document.addEventListener('DOMContentLoaded', function () {
    let taskInput = document.getElementById('task-input');
    let btnAddTask = document.getElementById('btn-task');
    let taskList = document.getElementById('task-list');
    let filterButtons = document.querySelectorAll('.filter');
    let toggleTheme = document.getElementById('toggle-theme');

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const themeKey = 'theme';
    const body = document.body;

    const setTheme = (theme) => {
        body.setAttribute('data-theme', theme);
        localStorage.setItem(themeKey, theme);
        toggleTheme.textContent = theme === 'dark' ? '🌙' : '☀️';
    };

    const savedTheme = localStorage.getItem(themeKey) || 'light';
    setTheme(savedTheme);

    toggleTheme.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks(filter = "") {
        taskList.innerHTML = "";

        tasks.forEach(function (task, index) {
            if (filter === "pending" && task.completed) return;
            if (filter === "completed" && !task.completed) return;

            const li = document.createElement("li");
            li.className = task.completed ? "completed" : "";

            li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <button class="complete">
                <img>✅</img>
            </button>
            <button class="edit">
                <img>✏️</img>
            </button>
            <button class="delete">
                <img>🗑️</img>
            </button>
        `;

        li.addEventListener('click', function (e) {
            if (e.target.closest(".delete")) {
                tasks.splice(index, 1);
                showToast("Tarefa excluída 🗑️");
            } else if (e.target.closest(".edit")) {
                const newText = prompt("Editar tarefa:", task.text);
                if (newText) {
                    tasks[index].text = newText;
                    showToast("Tarefa editada ✏️");
                }
            } else {
                tasks[index].completed = !tasks[index].completed;
                showToast("Tarefa atualizada ✅");
            }
            saveTasks();
            renderTasks(filter);
        });

            taskList.appendChild(li);
        });
    }

    btnAddTask.addEventListener('click', function () {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text: text, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = "";
        }
    });

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            filterButtons.forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            renderTasks(button.dataset.filter);
        });
    });

    renderTasks();

    function showToast(message = "Alteração feita ✅") {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }
    
});