var butn = document.querySelectorAll('.task-status-btn');
var addnew = document.querySelector('.add-new-task');
var taskList = document.querySelector('.task-list');
var start = document.querySelector('.to-do-list-start-btn');
var view = document.querySelector('.view-task-wrp');
var inputSelector = document.querySelectorAll('.add-new-task input[type = "text"]');
var timeSelect = document.querySelector('.new-task-time');
var dropdownSelect = document.querySelector('.category-dropdown');
var taskCount = document.querySelector('.task-count');
var searchBarSelect = document.querySelector('.search-bar');
var tempSelected = dropdownSelect.options[dropdownSelect.selectedIndex].value;
var dateSelected = document.querySelector('.add-new-task input[type = "date"]');
var timeSelected = document.querySelector('.add-new-task input[type = "time"]');


inputFilledCheck();

var tasks = getValueFromStorage();
if (tasks) {
    taskPresenceCheck();
    var createdDom = '';
    var finished = "";
    var timeRem = "";
    var taskLog = "";
    var completed = "";
    var colorset = "";
    sortByDate();
    tasks.forEach(function (e, ind) {
        finished = "";
        if (e.completed == "true") {
            completed = "completed-wrp";
            colorset = "completed";
        }
        taskLog = e.log;
        timeRem = timeCalculator(e.date, e.time);
        if (dateGenerator(e.date, e.time) < new Date()) {
            finished = "finished-task";
            taskLog = "FT";
            timeRem = "";
        }
        createdDom += "<div class='task-wrp " + finished + " " + completed + "' data-category = " + e.category + " data-completed = " + e.completed + " data-active = " + e.active + " data-id = " + ind + ">\
                        <div class='task-log "+ colorset + "'>" + taskLog + "</div>\
                        <div class='task-content-wrp'>\
                            <div class='ind-task-head'>"+ e.name + "</div>\
                            <div class='ind-task-desc'>"+ e.desc + "</div>\
                        </div>\
                        <div class='time-remains'>"+ timeRem + "</div>\
                        <div class='delete-icon'>x</div>\
                    </div>"
    });

    taskList.innerHTML = createdDom;
    taskCount.innerText = tasks.length + " items";
    addListenerForClick();
} else { tasks = [] }

function addNode(ele) {
    ele.classList.remove('mr-hide');
}
function removeNode(ele) {
    ele.classList.add('mr-hide');
}
function taskPresenceCheck() {
    if (tasks.length == 0) {
        addNode(start);
        removeNode(view);
    } else {
        addNode(view);
        removeNode(start);
    }
}

// button active state change while click
butn.forEach((element, ind) => {
    element.addEventListener('click', function () {
        butn.forEach(element => {
            element.classList.remove('btn-clicked');
        });
        this.classList.add('btn-clicked');
        tempSelected = dropdownSelect.options[dropdownSelect.selectedIndex].value;
        if (ind == 0) {
            filterTask("all", tempSelected);
        } else if (ind == 1) {
            filterTask("completed", tempSelected);
        } else if (ind == 2) {
            filterTask("active", tempSelected);
        } else {
            clearCompleted();
        }
    });
});

function sortByDate() {
    tasks.sort(function (a, b) {
        if (dateGenerator(a.date, a.time) < new Date()) {
            return 1;
        } else if (dateGenerator(b.date, b.time) < new Date()) {
            return -1;
        }
        return dateGenerator(a.date, a.time) - dateGenerator(b.date, b.time);
    });
}

// dropdown select change

dropdownSelect.addEventListener("click", function () {
    var dropdownValue = dropdownSelect.options[dropdownSelect.selectedIndex].value;
    if (tempSelected != dropdownValue) {
        document.querySelector('.btn-clicked').click();
    }
});


// filter task
function filterTask(arg, cat) {
    var alltask = document.querySelectorAll('.task-wrp');
    var count = 0;
    alltask.forEach(function (ele) {
        if (arg == "all") {
            if ((ele.dataset.category.toUpperCase() == cat.toUpperCase()) || cat.toUpperCase() == "ALL") {
                addNode(ele);
                count++;
            } else {
                removeNode(ele);
            }
        } else {
            if ((ele.dataset[arg] == "true") && ((ele.dataset.category.toUpperCase() == cat.toUpperCase()) || cat.toUpperCase() == "ALL")) {
                if (ele.classList.contains('finished-task')) {
                    removeNode(ele);
                } else {
                    addNode(ele);
                    count++;
                }
            } else {
                removeNode(ele);
            }
        }
    });
    taskCount.innerText = count + " items";
}

searchBarSelect.addEventListener("keyup", searchFilter);
function searchFilter() {
    var regex = new RegExp(this.value, 'gi');
    var alltask = document.querySelectorAll('.task-wrp');
    var temp = Array.from(alltask);
    var clickedbtn = document.querySelector('.btn-clicked').textContent;
    var count = 0;
    temp.filter(function (ele) {
        var text = ele.querySelector('.ind-task-head').textContent;
        var ctg = ele.dataset.category;
        if (text.match(regex)) {
            if (clickedbtn == "All") {
                if (tempSelected.toUpperCase() == "ALL" || (ctg.toUpperCase() == tempSelected.toUpperCase())) {
                    addNode(ele);
                    count++;
                } else {
                    removeNode(ele);
                }

            } else if (clickedbtn == "Completed") {
                if ((ctg.toUpperCase() == tempSelected.toUpperCase() || tempSelected == "all") && ele.dataset.completed == "true") {
                    addNode(ele);
                    count++;
                } else {
                    removeNode(ele);
                }
            } else {
                if ((ctg.toUpperCase() == tempSelected.toUpperCase() || tempSelected == "all") && ele.dataset.active == "true") {
                    if (ele.classList.contains('finished-task')) {
                        removeNode(ele);
                    } else {
                        addNode(ele);
                        count++;
                    }
                } else {
                    removeNode(ele);
                }
            }
        } else {
            removeNode(ele);
        }
    });
    taskCount.innerText = count + " items";
}

function clearCompleted() {
    var completedTask = document.querySelectorAll('.task-wrp[data-completed = "true"]');
    completedTask.forEach(function (ele) {
        var id = parseInt(ele.dataset.id);
        ele.parentNode.removeChild(ele);
        deleteFromLocalStorage(id);
    });
    butn[0].click();
    taskPresenceCheck();
}


// to add a new task

document.querySelector('.to-do-list-start-btn').addEventListener('click', function () {
    this.classList.add('mr-hide');
    addnew.classList.remove('mr-hide');
});


// add a new task

document.querySelector('.add-new-task-btn-wrp .save-btn').addEventListener('click', function () {
    inputFilledCheck();
    if (submitCheck()) {
        addnew.classList.add('mr-hide');
        view.classList.remove('mr-hide');
        createTask();
    }
});

// to add another task
document.querySelector('.view-task-wrp .add-btn').addEventListener('click', function () {
    addnew.classList.remove('mr-hide');
    view.classList.add('mr-hide');
    inputSelector.forEach(function (ele) {
        ele.value = "";
    });
    dateSelected.value = "";
    timeSelected.value = "";
    document.querySelector('.radio-btn-ref').checked = true;

});


// for validation
function submitCheck() {
    var checker = 0;
    inputSelector.forEach(function (e) {
        if (e.value.trim().length == 0) {
            checker = 1;
            showAndRemoveWarn(e);
        }
    });
    if (dateSelected.value == '') {
        checker = 1;
        showAndRemoveWarn(dateSelected);
    } else if (timeSelected.value == '') {
        checker = 1;
        showAndRemoveWarn(timeSelected);
    }
    if (dateGenerator(dateSelected.value, timeSelected.value) < new Date()) {
        checker = 1;
        dateSelected.nextElementSibling.innerHTML = 'Can\'t assign Task !!'
    }
    if (checker == 1) {
        return false;
    } else {
        return true;
    }
}
function inputFilledCheck() {
    inputSelector.forEach(function (ele) {
        ele.addEventListener('focusout', function () {
            showAndRemoveWarn(this);
        });
    });
    dateSelected.addEventListener('focusout', function () {
        showAndRemoveWarn(this);
    });
    timeSelected.addEventListener('focusout', function () {
        showAndRemoveWarn(this);
    });
}

function showAndRemoveWarn(_this) {
    var warn = "*please fill ";
    if (_this.value == '') {
        warn += _this.placeholder;
    } else {
        warn = '';
    }
    _this.nextElementSibling.innerHTML = warn;
}

// validation ends

// add event listener to the tasks

function addListenerForClick() {
    var existingTasks = document.querySelectorAll('.task-list .task-log')
    existingTasks.forEach(function (element) {
        element.addEventListener('click', function () {
            setCompletedStatus(this);
        });
    });

    var deleteNode = document.querySelectorAll('.task-wrp .delete-icon');
    deleteNode.forEach(function (ele) {
        ele.addEventListener("click", function () {
            var nodeToDelete = this.parentElement;
            var nodeIdToDelete = nodeToDelete.dataset.id;
            nodeToDelete.parentElement.removeChild(nodeToDelete);
            deleteFromLocalStorage(nodeIdToDelete);
            taskPresenceCheck();
        })
    });
}

function addListenerForSingleElement(temp) {
    temp.addEventListener('click', function () {
        setCompletedStatus(temp);
    });
}

function setCompletedStatus(ele) {
    var updatableId = "";
    var completedStatus = false;
    var btnSelector = document.querySelector('.btn-clicked');
    if (ele.classList.contains('completed')) {
        ele.classList.remove('completed');
        ele.parentElement.classList.remove('completed-wrp');
        ele.parentElement.dataset.completed = false;
        ele.parentElement.dataset.active = true;
        if (btnSelector.textContent == "Completed") {
            btnSelector.click();
        }
    } else {
        ele.classList.add('completed');
        ele.parentElement.classList.add('completed-wrp');
        ele.parentElement.dataset.completed = true;
        ele.parentElement.dataset.active = false;
        if (btnSelector.textContent == "Active") {
            btnSelector.click();
        }
    }
    updatableId = ele.parentElement.dataset.id;
    completedStatus = ele.parentElement.dataset.completed;
    updateData(updatableId, completedStatus)
}

// get the first letter of each word
function nameGenerator(taskName) {
    var newName = taskName.charAt(0).toUpperCase();
    var arr = taskName.split(' ');
    if (arr.length > 1) {
        newName += arr[arr.length - 1].charAt(0).toUpperCase();
    }
    return newName;
}

function createTask() {
    var taskName = document.querySelector('.new-task-name').value;
    var taskDesc = document.querySelector('.new-task-desc').value;
    var dateEntered = document.querySelector('.new-task-date').value;
    var hourEntered = document.querySelector('.new-task-time').value;
    var category = document.querySelectorAll('input[type="radio"]');
    var checkedVal = '';
    category.forEach(function (ele) {
        if (ele.checked) {
            checkedVal = ele.value;
        }
    })
    var id = 0;
    if (tasks.length > 0) {
        id = tasks.length;
    }
    var log = nameGenerator(taskName);
    var template = document.createElement('div');
    template.classList = "task-wrp";
    template.dataset.category = checkedVal;
    template.dataset.completed = "false";
    template.dataset.active = "true";
    template.dataset.id = id;
    var inner = document.createElement('div');
    inner.className = "task-log";
    inner.innerHTML = log;
    var cont = document.createElement('div');
    cont.className = "task-content-wrp";
    var head = document.createElement('div');
    head.className = "ind-task-head"
    head.innerHTML = taskName;
    var desc = document.createElement('div');
    desc.className = "ind-task-desc";
    desc.innerHTML = taskDesc;
    var timer = document.createElement('div');
    timer.className = "time-remains";
    timer.innerHTML = timeCalculator(dateEntered, hourEntered);
    var del = document.createElement('div');
    del.className = "delete-icon"
    cont.appendChild(head);
    cont.appendChild(desc);
    template.appendChild(inner);
    template.appendChild(cont);
    template.appendChild(timer);
    template.appendChild(del);
    taskList.appendChild(template);
    addListenerForSingleElement(inner);

    var taskObj = {}
    taskObj.id = id;
    taskObj.name = taskName;
    taskObj.desc = taskDesc;
    taskObj.category = checkedVal;
    taskObj.date = dateEntered;
    taskObj.time = hourEntered;
    taskObj.log = log;
    taskObj.completed = "false";
    taskObj.active = "true";
    tasks.push(taskObj);
    storeToLocalStorage(tasks);
}

function timeCalculator(dateEntered, hourEntered) {
    var now = new Date();
    var timeDiff = Math.abs(dateGenerator(dateEntered, hourEntered) - now);
    var days = parseInt(timeDiff / (1000 * 24 * 3600));
    timeDiff = timeDiff % (1000 * 24 * 3600);
    var hours = parseInt(timeDiff / (1000 * 3600));
    timeDiff %= (1000 * 3600);
    var minutes = parseInt((timeDiff / (1000 * 60)))
    return days + " days " + hours + " hr " + minutes + " min";
}

function dateGenerator(dateEntered, hourEntered) {
    dateEntered = dateEntered.split('-');
    hourEntered = hourEntered.split(':');
    return new Date(dateEntered[0], (dateEntered[1] - 1), dateEntered[2], hourEntered[0], hourEntered[1]);
}


function storeToLocalStorage(tasks) {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getValueFromStorage() {
    return JSON.parse(window.localStorage.getItem('tasks'));
}

function deleteFromLocalStorage(id) {
    tasks.forEach(function (task, ind) {
        if (task.id == id) {
            tasks.splice(ind, 1);
        }
    });
    storeToLocalStorage(tasks);
}

function updateData(id, status) {
    tasks[id].completed = status;
    storeToLocalStorage(tasks);
}