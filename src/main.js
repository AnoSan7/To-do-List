const sectionButton = document.querySelector("#section-button");
// const sectionRemoval=document.querySelector('#section-removal');
const taskButton = document.querySelector("#task-button");
const dialog1 = document.querySelector("#dialog1");
const dialog2 = document.querySelector("#dialog2");
// const dialog3=document.querySelector('#dialog3');
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

sectionButton.addEventListener("click", () => {
    dialog2.showModal();
});

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
    sectionElement.classList.add("section");
    sectionElement.textContent = sectionName;
    sectionList.appendChild(sectionElement);
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
    const taskElement = document.createElement("div");
    taskElement.classList.add("card");
    taskElement.innerHTML = `
        <h3 class="text-xl font-bold">${newTask.title}</h3>
        <p>${newTask.description}</p>
        <p>Due: ${newTask.dueDate}</p>
    `;
    taskElement.classList.add(priorityColor(newTask.priority));
    taskContainer.appendChild(taskElement);
});

allTasks.addEventListener("click", () => {
    if (document.querySelector(".focused")) {
        document.querySelector(".focused").classList.remove("focused");
    }
    allTasks.classList.add("focused");
    currSection = 0;
    taskContainer.innerHTML = "";
    tasks.forEach((task) => {
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
});

function priorityColor(priority) {
    if (priority === "High") {
        return "bg-red-500";
    } else if (priority === "Medium") {
        return "bg-yellow-500";
    } else {
        return "bg-green-500";
    }
}

sectionList.addEventListener("click", (e) => {
    if (e.target.classList.contains("section")) {
        if (document.querySelector(".focused")) {
            document.querySelector(".focused").classList.remove("focused");
        }
        e.target.classList.add("focused");
        const sectionName = e.target.textContent;
        currSection = sections.findIndex((section) => {
            return section.name === sectionName;
        });
        taskContainer.innerHTML = "";
        tasks.forEach((task) => {
            if (task.section === currSection) {
                const taskElement = document.createElement("div");
                taskElement.classList.add("card");
                taskElement.innerHTML = `
                    <h3 class="text-xl font-bold">${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Due: ${task.dueDate}</p>
                `;
                taskElement.classList.add(priorityColor(task.priority));
                taskContainer.appendChild(taskElement);
            }
        });
    }
});
