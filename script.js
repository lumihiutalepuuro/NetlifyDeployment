// Select elements from the DOM with using the IDs and store them in the variables for to be used later
const taskInput = document.getElementById("taskInput");             // This will select the input field     
const taskList = document.getElementById("taskList");                     // This will select the task list
const addTaskBtn = document.getElementById("addTaskBtn");           // This will select the add task button
const taskCounter = document.getElementById("taskCounter");         // This will select the task counter    
const errorMessage = document.getElementById("error-message");           // This will select the error message
const filter = document.getElementById("filter");                   // This will select the filter dropdown
const toggleBtn = document.getElementById("toggleBtn");             // This will select the toggle button

// Load tasks from localStorage on page load
window.onload = () => {                       // This will load the tasks from the local storage when page has been loaded  
    loadTasks();                              // This will load the tasks from the local storage
 //   updateCounter();                        // This will update the counter
    enableDragAndDrop();                      // This will enable the drag and drop functionality
};

// Here is the function to add a new task to the task list  
function addTask() {                            // This will add a new task to the task list when the add task button is clicked
    const taskText = taskInput.value.trim();       // This will get the value of the input field and remove the white spaces

    // This will be validating the task input       
    if (taskText === "" || taskText.length < 3) {        // This will check if the task input is empty or less than 3 characters
        errorMessage.textContent = "Task must be at least 3 characters!";    // This will show the error message if the task input is empty or too short
        taskInput.classList.add("invalid");         // This will add the invalid class to the input field if the task input is empty or too short
        return;                                   // This will return the function if the task input is empty or too short
    }

    // Here will be clearing the error message and remove invalid class :)           
    errorMessage.textContent = "";               // This will clear the error message if the task input is right        
    taskInput.classList.remove("invalid");      // This will remove the invalid class from the input field if the task input is right

    // Here we create a new task element and have it in to the task list 
    const li = document.createElement("li");        // This will create a new list item element
    li.textContent = taskText;     // This will set the text of the task to the input value
    li.draggable = true;          // This will make the drag & drop functionality work

    // This is checkbox to mark task as completed or not
    const checkbox = document.createElement("input");       // This will create a new input element for the checkbox    
    checkbox.type = "checkbox";                             // This will set the type of the input element to checkbox
    checkbox.addEventListener("change", () => {        // This will add an event listener to the checkbox
        li.classList.toggle("completed", checkbox.checked);   // This will toggle the completed class to the list item if the checkbox is checked
        saveTasks();                                      // This will save the tasks to the local storage
        updateCounter();                             // This will update the task counter
    });

    // Here is the delete button to remove the task from the list
    const deleteBtn = document.createElement("button");     // This will create a new button element for the delete button  
    deleteBtn.textContent = "X";                // This will set the text of the delete button to X     
    deleteBtn.style.background = "red";       // This will set the background color of the delete button to red
    deleteBtn.style.marginLeft = "10px";        // This will set the margin left of the delete button to 10px   
    deleteBtn.addEventListener("click", () => {    // This will add an event listener to the delete button  
        li.remove();                          // This will remove the list item from the task list      
        saveTasks();                // This will save the tasks to the local storage
        updateCounter();       // This will update the task counter 
    });

    // Append elements to task
    li.prepend(checkbox);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // Save to localStorage
    saveTasks();
    updateCounter();

    // Clear input field
    taskInput.value = "";

    // Re-enable drag & drop after adding a new task
    enableDragAndDrop();
}

// Function to update the task counter
function updateCounter() {
    const activeTasks = document.querySelectorAll("#taskList li:not(.completed)").length;
    taskCounter.textContent = `${activeTasks} tasks remaining`;
}

// Function to save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach((li) => {
        tasks.push({
            text: li.childNodes[1].nodeValue.trim(),
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task.text;
        li.draggable = true;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        if (task.completed) li.classList.add("completed");

        checkbox.addEventListener("change", () => {
            li.classList.toggle("completed", checkbox.checked);
            saveTasks();
            updateCounter();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.style.background = "red";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.addEventListener("click", () => {
            li.remove();
            saveTasks();
            updateCounter();
        });

        li.prepend(checkbox);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    updateCounter();
}

// Function to filter tasks
function filterTasks() {
    const filterValue = filter.value;
    document.querySelectorAll("#taskList li").forEach((li) => {
        if (filterValue === "all") {
            li.style.display = "flex";
        } else if (filterValue === "active" && !li.classList.contains("completed")) {
            li.style.display = "flex";
        } else if (filterValue === "completed" && li.classList.contains("completed")) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}

// Function to toggle task list visibility
function toggleVisibility() {
    taskList.style.display = taskList.style.display === "none" ? "block" : "none";
}

// Enable Drag & Drop functionality
function enableDragAndDrop() {
    const items = document.querySelectorAll("#taskList li");

    items.forEach((item) => {
        item.addEventListener("dragstart", () => {
            item.classList.add("dragging");
        });

        item.addEventListener("dragend", () => {
            item.classList.remove("dragging");
            saveTasks();
        });
    });

    taskList.addEventListener("dragover", (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector(".dragging");
        const afterElement = [...taskList.querySelectorAll("li:not(.dragging)")].find((el) => e.clientY < el.offsetTop + el.offsetHeight / 2);
        taskList.insertBefore(draggingItem, afterElement);
    });
}
