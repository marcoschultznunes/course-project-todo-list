/*
    Elements
*/
const inputTask = document.getElementById("input-task")
const addTaskButton = document.getElementById("add-task-button")
const taskList = document.getElementById("task-list")

/*
    Task array => Array holding all tasks
    Task count => Counter used for generating the task ids
*/
let taskArray = []
let taskCount = 0;

/*
    Save and load tasks
*/
const save = () => {
    localStorage.setItem("tasks", JSON.stringify(taskArray))
    localStorage.setItem("task_count", taskCount)
}

const load = () => {
    taskArray = JSON.parse(localStorage.getItem("tasks")) || []
    taskCount = JSON.parse(localStorage.getItem("task_count")) || 0
    if(taskArray.length > 0){
        taskArray.forEach(task => createTaskElement(task))
    }
    console.log(taskArray)
}

/*
    Find, delete, check
*/
const findTaskById = (id) => taskArray.find(task => task.id === id)
const findTaskByIdReturnIndex = (id) => taskArray.findIndex(task => task.id === id)

/*
    deleteTask => gets the task id from the task <li> element, splices the task array,
    removing the element and shifting the array, erases the <li> element from the DOM,
    saves.
*/
const deleteTask = (e) => {
    const taskElement = e.target.parentElement
    const taskId = Number(taskElement.getAttribute("task-id"))
    taskArray.splice(findTaskByIdReturnIndex(taskId), 1)
    taskElement.remove()
    save()
}

/*
    checkTask => gets the task id from the task <li> element, toggles the checked
    attribute, toggles the task-done CSS class, saves.
*/
const checkTask = (e) => {
    const taskElement = e.target.parentElement
    const taskId = Number(taskElement.getAttribute("task-id"))
    const task = findTaskById(taskId)
    task.checked = !task.checked
    taskElement.classList.toggle("task-done")
    save()
}

/*
    createTask => Creates the task object from just the name, adds it to the task
    array, calls createTaskElement() to add it to the DOM, iterates the task counter,
    then saves.
*/
const createTask = (name) => {
    const task = {name: name, id: taskCount, checked: false}
    taskArray.push(task)
    createTaskElement(task)
    taskCount++
    save()
}

/*
    createTaskElement => Creates the HTML element and adds it to the DOM
*/
const createTaskElement = (task) => {
    const taskItem = document.createElement("li")
    taskItem.setAttribute("task-id", task.id + "")
    taskItem.classList.add("task-item")

    const taskCheckbox = document.createElement("input")
    taskCheckbox.setAttribute("type", "checkbox")
    taskCheckbox.addEventListener("change", checkTask)
    taskCheckbox.classList.add("task-checkbox")

    const taskSpan = document.createElement("span")
    taskSpan.innerHTML = task.name
    taskSpan.classList.add("task")

    const deleteBtn = document.createElement("button")
    deleteBtn.innerHTML = "X"
    deleteBtn.addEventListener("click", deleteTask)
    deleteBtn.classList.add("delete-btn")

    taskItem.append(taskCheckbox, taskSpan, deleteBtn)
    taskList.prepend(taskItem)

    if(task.checked){
        taskCheckbox.setAttribute("checked", "")
        taskItem.classList.add("task-done")
    }
}

/*
    event listeners
*/
addTaskButton.addEventListener("click", () => {
    createTask(inputTask.value)
    inputTask.value=""
})
inputTask.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addTaskButton.click();
    }
})

// Load tasks
load()
