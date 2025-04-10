let existingTasks = JSON.parse(localStorage.getItem("existingTasks")) || [];

let taskno = localStorage.getItem("taskno") || 1;

let taskList = document.querySelector(".task-list");

function createTaskbox() {
    let taskbox = document.createElement("div");
    taskbox.className = "task"
    taskList.appendChild(taskbox);

    return taskbox;
}

function createCheckbox(taskbox,taskno,isChecked, taskLabel) {
    let taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.className = "task-checkbox";
    taskCheckbox.id = taskno;
    taskCheckbox.checked = isChecked;

    taskCheckbox.addEventListener("change", () =>{
        taskStatus(taskLabel);
        createObj(taskno, taskCheckbox.checked , taskLabel.innerText);
    })

    taskbox.appendChild(taskCheckbox);
}

function createLabel(taskbox,taskno,taskText, isChecked) {
    let taskLabel = document.createElement("label");
    taskLabel.className = "task-label";
    taskLabel.innerText = taskText;
    taskLabel.htmlFor = taskno;
    if (isChecked) {
        taskLabel.classList.add("task-done");
    }

    return taskLabel;
}

function createDeleteIcon(taskbox, taskno) {
    let taskDelete = document.createElement("i");
    taskDelete.className = "fa-solid fa-trash delete-task";


    taskDelete.addEventListener("click", () => {
        deleteTask(taskbox,taskno);
    });

    taskbox.appendChild(taskDelete);
}

function createObj(taskno,isChecked,taskText) {
    let objExist = -1;
    existingTasks.forEach((oldObj,index) => {
        if (oldObj.taskno == taskno) {
            objExist = index;
        }
    })
    if (objExist > -1) {
        existingTasks[objExist].isChecked = isChecked;
    }
    else {
        existingTasks.push ({
        taskno : taskno,
        isChecked : isChecked,
        taskText : taskText
        });
    }

    syncStorage();
}


function createTask(taskno,taskText) {
    let taskbox = createTaskbox();
    let taskLabel = createLabel(taskbox,taskno,taskText, false);
    createCheckbox(taskbox,taskno,false, taskLabel);
    taskbox.appendChild(taskLabel);
    createDeleteIcon(taskbox,taskno);
    createObj(taskno,false,taskText);
}

function fetchTask(taskno,isChecked,taskText) {
    let taskbox = createTaskbox();
    let taskLabel = createLabel(taskbox,taskno,taskText,isChecked);
    createCheckbox(taskbox,taskno,isChecked,taskLabel);
    taskbox.appendChild(taskLabel);
    
    createDeleteIcon(taskbox,taskno);
}

document.querySelector(".submit-task").addEventListener("click", () => {
    let taskText = document.querySelector(".enter-task");
    if (taskText.value.trim() !== "") {
        createTask(taskno,taskText.value);
        taskno++;
        localStorage.setItem("taskno",taskno);
    }
    taskText.value = "";  
});

function taskStatus(taskLabel) {
    taskLabel.classList.toggle("task-done");
}

function deleteTask(taskbox,taskno) {
    taskbox.remove();
    existingTasks.forEach((oldObj,index) => {
        if (oldObj.taskno == taskno) {
            existingTasks.splice(index,1);
        }
    })
    syncStorage();
}

function syncStorage() {
    localStorage.setItem("existingTasks", JSON.stringify(existingTasks));
}

existingTasks.forEach(task => {
    fetchTask(task.taskno, task.isChecked, task.taskText);
});