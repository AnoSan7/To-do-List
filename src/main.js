const sectionButton = document.querySelector("#section-button");
const sectionRemoval = document.querySelector("#section-removal");
const taskButton = document.querySelector("#task-button");
const sidebarToggle = document.querySelector("#sidebar-toggle");
const sidebarClose = document.querySelector("#sidebar-close");
const sidebarBackdrop = document.querySelector("#sidebar-backdrop");
const appShell = document.querySelector(".app-shell");
const dialog1 = document.querySelector("#dialog1");
const dialog2 = document.querySelector("#dialog2");
const taskCancel = document.querySelector("#task-cancel");
const sectionCancel = document.querySelector("#section-cancel");
const taskContainer = document.querySelector("#task-container");
const allTasks = document.querySelector("#all-tasks");
const sectionSubmit = document.querySelector("#section-submit");
const taskSubmit = document.querySelector("#task-submit");
const sectionList = document.querySelector("#section-list");

class Section {
    constructor(name) {
        this.name = name;
        this.id = crypto.randomUUID();
    }
}

let currSection = 0;
let sections = [new Section("All")];

class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.id = crypto.randomUUID();
        this.section = currSection;
    }
}

let tasks = [];

function openSidebar() {
    appShell.classList.add("sidebar-open");
    sidebarToggle.setAttribute("aria-expanded", "true");
}

function closeSidebar() {
    appShell.classList.remove("sidebar-open");
    sidebarToggle.setAttribute("aria-expanded", "false");
}

function renderTasks(sectionIndex = currSection) {
    taskContainer.innerHTML = "";

    tasks.forEach((task) => {
        if (sectionIndex !== 0 && task.section !== sectionIndex) {
            return;
        }

        const taskElement = document.createElement("div");
        taskElement.classList.add("card");
        taskElement.innerHTML = `
            <h3 class="text-xl font-bold">${task.title}</h3>
            <p>${task.description}</p>
            <p>Due: ${task.dueDate}</p>
        `;
        taskElement.classList.add(priorityColor(task.priority));
        taskContainer.appendChild(taskElement);
    });
}

function setFocusedButton(button) {
    if (document.querySelector(".focused")) {
        document.querySelector(".focused").classList.remove("focused");
    }

    button.classList.add("focused");
}

sectionButton.addEventListener("click", () => {
    dialog2.showModal();
});

sidebarToggle.addEventListener("click", () => {
    if (appShell.classList.contains("sidebar-open")) {
        closeSidebar();
    } else {
        openSidebar();
    }
});

sidebarClose.addEventListener("click", closeSidebar);

sidebarBackdrop.addEventListener("click", closeSidebar);

taskButton.addEventListener("click", () => {
    dialog1.showModal();
});

taskCancel.addEventListener("click", () => {
    dialog1.close();
});

sectionCancel.addEventListener("click", () => {
    dialog2.close();
});

document.addEventListener("DOMContentLoaded", () => {
    if (!allTasks.classList.contains("focused")) {
        allTasks.classList.add("focused");
    }

    closeSidebar();
});

sectionSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    const sectionName = document.querySelector("#section-name").value;
    const newSection = new Section(sectionName);
    sections.push(newSection);
    console.log(sections);
    document.querySelector("#section-form").reset();
    dialog2.close();
    const sectionElement = document.createElement("button");
    sectionElement.classList.add("section-item", "section");
    sectionElement.textContent = sectionName;
    sectionList.appendChild(sectionElement);
    closeSidebar();
});

sectionRemoval.addEventListener("click", () => {
    if (currSection === 0) {
        return;
    }

    sections.splice(currSection, 1);
    tasks = tasks
        .filter((task) => task.section !== currSection)
        .map((task) => {
            if (task.section > currSection) {
                return { ...task, section: task.section - 1 };
            }

            return task;
        });

    sectionList.children[currSection].remove();
    currSection = 0;
    setFocusedButton(allTasks);
    renderTasks();
    closeSidebar();
});

taskSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    const title = document.querySelector("#task-title").value;
    const description = document.querySelector("#task-description").value;
    const dueDate = document.querySelector("#task-due-date").value;
    const priority = document.querySelector("#task-priority").value;
    const newTask = new Task(title, description, dueDate, priority);
    tasks.push(newTask);
    console.log(tasks);
    document.querySelector("#task-form").reset();
    dialog1.close();
    renderTasks();
});

allTasks.addEventListener("click", () => {
    setFocusedButton(allTasks);
    currSection = 0;
    renderTasks();
    closeSidebar();
});

function priorityColor(priority) {
    if (priority === "High") {
        return "card--high";
    } else if (priority === "Medium") {
        return "card--medium";
    } else {
        return "card--low";
    }
}

sectionList.addEventListener("click", (e) => {
    if (e.target.classList.contains("section")) {
        setFocusedButton(e.target);
        const sectionName = e.target.textContent;
        currSection = sections.findIndex((section) => {
            return section.name === sectionName;
        });
        renderTasks();
        closeSidebar();
    }
});
