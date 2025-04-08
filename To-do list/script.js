const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Add Confetti Script
const confettiScript = document.createElement("script");
confettiScript.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1";
document.body.appendChild(confettiScript);

function addTask() {
    if (!inputBox.value.trim()) {  
        alert("You must write something!!");
        return;
    }

    let li = document.createElement("li");
    li.textContent = inputBox.value;
    listContainer.appendChild(li);

    // Add delete button
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    // Double-click to edit
    li.addEventListener("dblclick", function () {
        editTask(li);
    });

    saveData();
    inputBox.value = "";
}

// Edit task
function editTask(li) {
    let currentText = li.firstChild.textContent;
    let input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.classList.add("edit-input");

    li.innerHTML = "";
    li.appendChild(input);
    input.focus();

    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            saveEditedTask(li, input);
        }
    });

    input.addEventListener("blur", function () {
        saveEditedTask(li, input);
    });
}

function saveEditedTask(li, input) {
    if (input.value.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }

    li.innerHTML = input.value;

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    li.addEventListener("dblclick", function () {
        editTask(li);
    });

    saveData();
}

// Event Listener for task completion & delete
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
        checkCompletion(); // Check if all tasks are completed
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
        checkCompletion();
    }
}, false);

// Save data in localStorage
function saveData() {
    let tasks = [];
    document.querySelectorAll("#list-container li").forEach((task) => {
        tasks.push({
            text: task.textContent.replace("\u00d7", "").trim(),
            completed: task.classList.contains("checked")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Show tasks from localStorage
function showTask() {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Check if all tasks are completed
    const allCompleted = savedTasks.length > 0 && savedTasks.every(task => task.completed);

    if (allCompleted) {
        localStorage.removeItem("tasks");
        listContainer.innerHTML = "";
        return;
    }

    savedTasks.forEach(task => {
        let li = document.createElement("li");
        li.textContent = task.text;

        if (task.completed) {
            li.classList.add("checked");
        }

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);

        li.addEventListener("dblclick", function () {
            editTask(li);
        });

        listContainer.appendChild(li);
    });
}

// Check if all tasks are completed
function checkCompletion() {
    let tasks = document.querySelectorAll("#list-container li");
    if (tasks.length === 0) return;

    let allCompleted = Array.from(tasks).every(task => task.classList.contains("checked"));

    if (allCompleted) {
        setTimeout(() => {
            showCongratulations();
            localStorage.removeItem("tasks");
            listContainer.innerHTML = "";
        }, 500);
    }
}

// Show congratulations message with confetti
function showCongratulations() {
    let congratsDiv = document.createElement("div");
    congratsDiv.innerHTML = "🎉 Congratulations! You completed all tasks! 🎉";
    congratsDiv.style.position = "fixed";
    congratsDiv.style.top = "50%";
    congratsDiv.style.left = "50%";
    congratsDiv.style.transform = "translate(-50%, -50%)";
    congratsDiv.style.background = "#7a8c9d";
    congratsDiv.style.color = "white";
    congratsDiv.style.padding = "20px";
    congratsDiv.style.fontSize = "20px";
    congratsDiv.style.borderRadius = "10px";
    congratsDiv.style.zIndex = "1000";
    document.body.appendChild(congratsDiv);

    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    setTimeout(() => {
        congratsDiv.remove();
    }, 3000);
}

showTask();

// Add task on Enter key
inputBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});
