let tasksData = {};

const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');

const columns = [todo, progress, done];

let dragElement = null;

// ✅ ADD TASK
function addTask(title, description, column) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <button class="delete-btn">Delete</button>
    `;

    column.appendChild(div);

    // ✅ drag fix
    div.addEventListener('dragstart', () => {
        dragElement = div;
    });

    // ✅ delete button
    div.querySelector('.delete-btn').addEventListener('click', () => {
        div.remove();
        updateTaskCount();
    });

    return div;
}

// ✅ UPDATE COUNT + LOCAL STORAGE
function updateTaskCount() {
    columns.forEach(col => {
        const tasks = col.querySelectorAll('.task');
        const count = col.querySelector('.right');

        tasksData[col.id] = Array.from(tasks).map(t => {
            return {
                title: t.querySelector('h2').innerText,
                description: t.querySelector('p').innerText
            };
        });

        if (count) count.innerText = tasks.length;
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// ✅ LOAD FROM LOCAL STORAGE
if (localStorage.getItem("tasks")) {
    tasksData = JSON.parse(localStorage.getItem("tasks"));

    for (const col in tasksData) {
        const column = document.querySelector(`#${col}`);

        tasksData[col].forEach(task => {
            addTask(task.title, task.description, column);
        });
    }

    updateTaskCount();
}

// ✅ DRAG & DROP
function addDragEventListeners(column) {
    column.addEventListener('dragenter', (e) => {
        e.preventDefault();
        column.classList.add('hover-over');
    });

    column.addEventListener('dragleave', () => {
        column.classList.remove('hover-over');
    });

    column.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        if (dragElement) {
            column.appendChild(dragElement);
            updateTaskCount();
        }
        column.classList.remove('hover-over');
    });
}

columns.forEach(col => addDragEventListeners(col));


// ✅ MODAL LOGIC
const toggleModalBtn = document.querySelector('#toggle-modal');
const modalbg = document.querySelector('.modal .bg');
const modal = document.querySelector('.modal');
const addTaskBtn = document.querySelector("#add-new-task");

toggleModalBtn.addEventListener('click', () => {
    modal.classList.toggle("active");
});

modalbg.addEventListener('click', () => {
    modal.classList.remove("active");
});

addTaskBtn.addEventListener("click", () => {
    const taskTitle = document.querySelector("#task-title-input").value;
    const taskdescription = document.querySelector("#task-description-input").value;

    if (taskTitle.trim() === "") return;

    addTask(taskTitle, taskdescription, todo);
    updateTaskCount();

    modal.classList.remove("active");
});
/* API Integration + auto-refresh */
async function fetchSuggestion() {
    try {
        const res = await fetch("https://api.adviceslip.com/advice?" + new Date().getTime());
        const data = await res.json();
        const advice = data.slip.advice;
        document.querySelector("#motivation").innerText = `💡 ${advice}`;
    } catch (e) {
        document.querySelector("#motivation").innerText = "💡 Keep slaying your tasks!";
    }
}

// first fetch immediately
fetchSuggestion();

// then refresh every 10 seconds (10000ms)
setInterval(fetchSuggestion, 10000);
//nav animation
gsap.from("nav", {
  y: -50,
  opacity: 0,
  duration: 0.6
});

gsap.from(".ai-box", {
  
  duration: 0.6,
  delay: 0.3
});
