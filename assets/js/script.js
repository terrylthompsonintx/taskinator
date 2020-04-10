var pageContentEl = document.querySelector(".page-content");
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];
var createTaskActions = function(taskId) {
  //console.log('fired');
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);
  var statusSelectEl = document.createElement("select");
  var statusChoices = ["To Do", "In Progress", "Completed"];
  for (var i = 0; i < statusChoices.length; i++) {
    // create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);
  
    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  }
  actionContainerEl.appendChild(statusSelectEl);
  return actionContainerEl;
};
var createTaskEl = function(taskDataObj) {
    var listItemEl = document.createElement("li");
    listItemEl.setAttribute("draggable", "true");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    var taskInfoEl = document.createElement("div");
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    
    listItemEl.appendChild(taskInfoEl);
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    tasksToDoEl.appendChild(listItemEl);
   
    taskDataObj.id = taskIdCounter;
    console.log(taskDataObj);
    console.log(taskDataObj.status);
    tasks.push(taskDataObj);
    taskIdCounter++;
}


var taskFormHandler = function() {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
      }
      formEl.reset();
    var isEdit = formEl.hasAttribute("data-task-id");
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
      };

    taskDataObj.name=taskNameInput;
    taskDataObj.type=taskTypeInput;
    
    if (isEdit) {
      var taskId = formEl.getAttribute("data-task-id");
      completeEditTask(taskNameInput, taskTypeInput, taskId);
    } 
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
      var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
      };
    
      createTaskEl(taskDataObj);
    }
    //createTaskEl(taskDataObj);
  }
  var taskButtonHandler = function(event) {
    //console.log(event.target);
    var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } 
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);taskFormHandler()
  }
  };
  var deleteTask = function(taskId) {
    console.log(taskId);
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
      // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
      if (tasks[i].id !== parseInt(taskId)) {
        updatedTaskArr.push(tasks[i]);
      }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
  };
  var editTask = function(taskId) {
    //console.log("editing task #" + taskId);
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    document.querySelector("input[name='task-name']").value = taskName;

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
  };
  var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === parseInt(taskId)) {
        tasks[i].name = taskName;
        tasks[i].type = taskType;
      }
    };
    alert("Task Updated!");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
  };
  var taskStatusChangeHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    var statusValue = event.target.value;
    console.log (statusValue);
    if (statusValue === "To Do") {
      tasksToDoEl.appendChild(taskSelected);
    } 
    else if (statusValue === "In Progress") {
      tasksInProgressEl.appendChild(taskSelected);
    } 
    else if (statusValue === "Completed") {
      tasksCompletedEl.appendChild(taskSelected);
    }
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === parseInt(taskId)) {
        tasks[i].status = statusValue;
      }
    }
    console.log(tasks);
  };

  var dragTaskHandler = function(event){
    
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
    var getId = event.dataTransfer.getData("text/plain");
    console.log("getId:", getId, typeof getId);
  }
  var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
      event.preventDefault();
      taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
      
    }
  };
  var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    if (statusType === "tasks-to-do") {
      statusSelectEl.selectedIndex = 0;
    } 
    else if (statusType === "tasks-in-progress") {
      statusSelectEl.selectedIndex = 1;
    } 
    else if (statusType === "tasks-completed") {
      statusSelectEl.selectedIndex = 2;
    }
    dropZoneEl.removeAttribute("style");
    dropZoneEl.appendChild(draggableElement);
  };
  var dragLeaveHandler = function(event) {
    console.dir(event.target);
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
      taskListEl.removeAttribute("style");
    }
  }

  formEl.addEventListener("submit", taskFormHandler);
  pageContentEl.addEventListener("click", taskButtonHandler);
  pageContentEl.addEventListener("change", taskStatusChangeHandler);
  pageContentEl.addEventListener("dragstart", dragTaskHandler);
  pageContentEl.addEventListener("dragover", dropZoneDragHandler);
  pageContentEl.addEventListener("drop", dropTaskHandler);
  pageContentEl.addEventListener("dragleave", dragLeaveHandler);