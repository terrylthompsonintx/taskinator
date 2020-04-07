var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function() {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    var taskInfoEl = document.createElement("div");
    
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";
    //listItemEl.textContent = taskNameInput;
    //listItemEl.textContent = taskTypeInput;
    listItemEl.appendChild(taskInfoEl);
    console.log(taskInfoEl);
    tasksToDoEl.appendChild(listItemEl);
  }
  formEl.addEventListener("submit", createTaskHandler);