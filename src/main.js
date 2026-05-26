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
const taskForm = document.querySelector("#task-form");
const taskDialogTitle = document.querySelector("#task-dialog-title");
const taskTitleInput = document.querySelector("#task-title");
const taskDescriptionInput = document.querySelector("#task-description");
const taskDueDateInput = document.querySelector("#task-due-date");
const taskPriorityInput = document.querySelector("#task-priority");
const sectionList = document.querySelector("#section-list");
const STORAGE_KEY = "todo-list-state";

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
let editingTaskId = null;

function loadState() {
    try {
        const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (!savedState) {
            return;
        }

        sections = Array.isArray(savedState.sections) && savedState.sections.length
            ? savedState.sections
            : [new Section("All")];

        if (sections[0]?.name !== "All") {
            sections.unshift(new Section("All"));
        }

        let backfilledIds = false;
        tasks = Array.isArray(savedState.tasks)
            ? savedState.tasks.map((task) => {
                if (task.id) {
                    return task;
                }

                backfilledIds = true;
                return { ...task, id: crypto.randomUUID() };
            })
            : [];
        currSection = Number.isInteger(savedState.currSection)
            ? savedState.currSection
            : 0;

        if (backfilledIds) {
            saveState();
        }
    } catch {
        sections = [new Section("All")];
        tasks = [];
        currSection = 0;
    }
}

function saveState() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
            sections,
            tasks,
            currSection,
        }),
    );
}

function renderSections() {
    sectionList.querySelectorAll(".section").forEach((button) => {
        button.remove();
    });

    sections.slice(1).forEach((section) => {
        const sectionElement = document.createElement("button");
        sectionElement.classList.add("section-item", "section");
        sectionElement.textContent = section.name;
        sectionList.appendChild(sectionElement);
    });
}

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
        taskElement.dataset.taskId = String(task.id);
        taskElement.setAttribute("role", "article");
        taskElement.setAttribute("aria-label", `Task ${task.title}`);

        const header = document.createElement("div");
        header.classList.add("card-header");

        const title = document.createElement("h3");
        title.classList.add("text-xl", "font-bold");
        title.textContent = task.title;

        const actions = document.createElement("div");
        actions.classList.add("card-actions");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.classList.add("icon-button");
        editButton.dataset.action = "edit";
        editButton.setAttribute("aria-label", "Edit task");
        editButton.title = "Edit task";
        editButton.textContent = "✏️";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("icon-button");
        deleteButton.dataset.action = "delete";
        deleteButton.setAttribute("aria-label", "Delete task");
        deleteButton.title = "Delete task";
        deleteButton.textContent = "🗑️";

        actions.append(editButton, deleteButton);
        header.append(title, actions);

        const description = document.createElement("p");
        description.textContent = task.description;

        const due = document.createElement("p");
        due.textContent = `Due: ${task.dueDate}`;

        taskElement.append(header, description, due);
        taskElement.classList.add(priorityColor(task.priority));
        taskContainer.appendChild(taskElement);
    });
}

function resetTaskDialog() {
    editingTaskId = null;
    taskDialogTitle.textContent = "Create new task";
    taskSubmit.textContent = "Create";
    taskForm.reset();
}

function openEditDialog(task) {
    editingTaskId = task.id;
    taskDialogTitle.textContent = "Edit task";
    taskSubmit.textContent = "Save";
    taskTitleInput.value = task.title;
    taskDescriptionInput.value = task.description;
    taskDueDateInput.value = task.dueDate;
    taskPriorityInput.value = task.priority;
    dialog1.showModal();
}

function setFocusedButton(button) {
    if (document.querySelector(".focused")) {
        document.querySelector(".focused").classList.remove("focused");
    }

    button.classList.add("focused");
}

function syncActiveSection() {
    if (currSection === 0) {
        setFocusedButton(allTasks);
        return;
    }

    const sectionButtons = sectionList.querySelectorAll(".section");
    const activeButton = sectionButtons[currSection - 1];

    if (activeButton) {
        setFocusedButton(activeButton);
        return;
    }

    currSection = 0;
    setFocusedButton(allTasks);
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
    resetTaskDialog();
    dialog1.showModal();
});

taskCancel.addEventListener("click", () => {
    resetTaskDialog();
    dialog1.close();
});

sectionCancel.addEventListener("click", () => {
    dialog2.close();
});

loadState();
renderSections();
syncActiveSection();
renderTasks();
closeSidebar();

sectionSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    const sectionName = document.querySelector("#section-name").value;
    const newSection = new Section(sectionName);
    sections.push(newSection);
    document.querySelector("#section-form").reset();
    dialog2.close();
    renderSections();
    syncActiveSection();
    saveState();
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
    renderSections();
    syncActiveSection();
    renderTasks();
    saveState();
    closeSidebar();
});

taskSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    const title = taskTitleInput.value;
    const description = taskDescriptionInput.value;
    const dueDate = taskDueDateInput.value;
    const priority = taskPriorityInput.value;

    if (editingTaskId) {
        const taskIndex = tasks.findIndex((task) => task.id === editingTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                title,
                description,
                dueDate,
                priority,
            };
        }
    } else {
        const newTask = new Task(title, description, dueDate, priority);
        tasks.push(newTask);
    }

    resetTaskDialog();
    dialog1.close();
    renderTasks();
    saveState();
});

allTasks.addEventListener("click", () => {
    setFocusedButton(allTasks);
    currSection = 0;
    renderTasks();
    saveState();
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
        saveState();
        closeSidebar();
    }
});

taskContainer.addEventListener("click", (event) => {
    const actionButton = event.target.closest("button[data-action]");
    if (!actionButton) {
        return;
    }

    const taskCard = actionButton.closest(".card");
    const taskId = taskCard?.dataset.taskId;
    if (!taskId) {
        return;
    }

    const task = tasks.find((entry) => String(entry.id) === taskId);
    if (!task) {
        return;
    }

    if (actionButton.dataset.action === "edit") {
        openEditDialog(task);
        return;
    }

    if (actionButton.dataset.action === "delete") {
        tasks = tasks.filter((entry) => String(entry.id) !== taskId);
        renderTasks();
        saveState();
    }
});
