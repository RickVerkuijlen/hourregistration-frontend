const { ipcRenderer, dialog, Menu } = require('electron')
const fs = require('fs');
require('dotenv').config({path: process.cwd() + '/src/assets/.env'})
const _baseFolder = "V:\\Tekeningen\\";
const _ = require('lodash');

var currentProject;
var startTime;

var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");
var historyMenu = document.getElementById("history");
var historyList = document.getElementById("historyList");
var blackOverlay = document.getElementById("black-overlay");
var isWorking = false;
var inputs = document.forms['projectInfo'].querySelectorAll('input, select, textarea');
var user = JSON.parse(localStorage.getItem("user"));
var historyProjects = new Array();



window.onload = async () => {
    document.getElementById("addProject").addEventListener('click', openNewProject);
    var implementorSelect = document.getElementById('implementorList');
    await getAllImplementors()
    .then(implementors => {
        implementors.forEach(element => {
            var option = document.createElement("option")
            option.value = element.id;
            option.innerHTML = element.name;
            implementorSelect.appendChild(option);
        });
    })

    if(!user) {
        ipcRenderer.send('to-login');
    } else {
        document.getElementById("userWelcome").innerHTML += JSON.parse(localStorage.getItem("user")).name;

        var finances = document.getElementById("finance-tab-button");

        if(user.isAdmin) {
            finances.style.display = "inline-block";
        } else {
            finances.parentNode.removeChild(finances);
        }
        var project = JSON.parse(localStorage.getItem("lastProject"));
        
        if(project) {
            this.currentProject = await setProject(project.code);
            initialize(this.currentProject);
        } else {
            ipcRenderer.send('to-search')
        }

        console.log(this.currentProject);
    }
}

function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab");
    var button = document.getElementById(tabName+"-tab-button");
    var buttons = document.getElementsByClassName("tab-button")
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
        x[i].style.opacity = "0";
        buttons[i].classList.remove("active")
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).style.opacity = "1";
    button.classList.add("active")
}

function searchProjects() {
    ipcRenderer.send('to-search');
}

function showMonthlyOverview() {
    ipcRenderer.send('to-monthly-overview');
}

function openNewProject() {
    ipcRenderer.send('to-new-project');
}

function showWeeklyOverview() {
    ipcRenderer.send('to-weekly-overview');
}

function openWriting() {
    ipcRenderer.send('to-writing');
}

function openFolder() {
    console.log(_baseFolder + this.currentProject.code)
    require('child_process').exec('start "" ' + _baseFolder + this.currentProject.code);
}

function startHours() {
    startTime = new Date().getTime();
    console.log("Started on " + startTime)
    isWorking = true;
    localStorage.setItem("isWorking", isWorking);
    startButton.style.display = "none";
    stopButton.style.display = "block";
    window.document.title = currentProject.code + " - " + window.document.title;
    disableInputs();
    localStorage.setItem("status", "Werkend aan project " + this.currentProject.code);
    document.getElementById('statusValue').innerHTML = localStorage.getItem('status');
}

function stopHours() {
    var workTime = new Date().getTime() - startTime;
    console.log("Gewerkte minuten: " + Math.ceil(workTime / 60000))
    isWorking = false;
    localStorage.setItem("isWorking", isWorking);
    startButton.style.display = "block";
    stopButton.style.display = "none";
    window.document.title = window.document.title.substr(window.document.title.indexOf("-") + 1);
    calculateHours(workTime);
    enableInputs();
    localStorage.setItem("status", "Stand-by");
    document.getElementById('statusValue').innerHTML = localStorage.getItem('status');
}

function calculateHours(workTime) {
    var timeInSeconds = ((workTime / 1000));
    if(timeInSeconds > (5 * 60)) { //Only push to database if longer than 5 minutes
        var decimal = timeInSeconds * (1 / 3600);

        let today = new Date();

        today = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

        var hour = new Hour(currentProject.code, user.userId, today, decimal);

        saveHour(hour);
    } else {
       showTimeWarning();
    }

}

function showTimeWarning() {
    var timeWarning = document.getElementById('timeWarning')
    timeWarning.style.visibility = "visible";
    timeWarning.style.opacity = 1;
    setTimeout(function() { 
        timeWarning.style.visibility = "hidden";
        timeWarning.style.opacity = 0;
    }, 3000)
}

function disableInputs() {
    document.getElementById("userWelcome").onclick = () => {return false; }
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }
    document.getElementById("updateButton").disabled = true;
    document.getElementById("addProject").removeEventListener('click', openNewProject);
    document.getElementById("addProject").classList.add("disabled");
}

function enableInputs() {
    document.getElementById("userWelcome").onclick = () => {return changeUser();}
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
    }
    document.getElementById("updateButton").disabled = false;
    document.getElementById("addProject").addEventListener('click', openNewProject);
    document.getElementById("addProject").classList.remove("disabled");
}


ipcRenderer.on('set-project', async (event, args) => {
    setProject(args);
})

async function setProject(args) {
    var project = await getProjectByCode(args);
    return Promise.all([getClient(project.clientId), getImplementor(project.implementorId)])
    .then(values => {
        currentProject = project;
        currentProject.client = values[0];
        currentProject.implementor = values[1];

        initialize(currentProject);
        localStorage.setItem("lastProject", JSON.stringify(currentProject));
        setHistory(currentProject);
        return currentProject;
    });
}

function changeUser() {
    localStorage.removeItem("user");
    ipcRenderer.send("reload-parent");
}


function setHistory(project) {
    historyProjects = JSON.parse(localStorage.getItem("historyProjects"));
    project.client = Object.assign({}, project.client);
    project.implementor = Object.assign({}, project.implementor);
    var newHistory = Object.assign({}, project);

    if(!historyProjects) {
        historyProjects = new Array();
    }
    
    historyProjects.unshift(newHistory);
    let unique = _.uniqWith(historyProjects, _.isEqual);
    historyProjects = unique.splice(0, 10);
    localStorage.setItem("historyProjects", JSON.stringify(historyProjects));
}

function initialize(currentProject) {
    document.getElementById("implementorList").value = currentProject.implementor.id;
    document.getElementById("company").value = currentProject.client.company;
    document.getElementById("workCode").value = currentProject.code;
    document.getElementById("name").value = currentProject.client.name;
    document.getElementById("initials").value = currentProject.client.initials;
    document.getElementById("address").value = currentProject.client.address;
    document.getElementById("zipcode").value = currentProject.client.zipCode;
    document.getElementById("city").value = currentProject.client.city;
    document.getElementById("tel").value = currentProject.client.phone;
    document.getElementById("email").value = currentProject.client.email;
    document.getElementById("description").value = currentProject.description;
    document.getElementById("particularities").value = currentProject.particularities;
    document.getElementById("buildAddress").value = currentProject.buildAddress;
    document.getElementById("buildCity").value = currentProject.buildCity;
    document.getElementById("buildZipcode").value = currentProject.buildZipcode;
    document.getElementById("finances").value = currentProject.finances;
    document.getElementById("finances_extra").value = currentProject.finances_extra;
}

function changeProjectValue(event) {
    var multi = event.name.split(".")
    eventName = multi[0];

    if(eventName == "client") {
        currentProject.client[multi[1]] = event.value
    } else {
        currentProject[event.name] = event.value;
    }
}

function saveChanges() {
    localStorage.setItem("lastProject", JSON.stringify(currentProject));
    updateClient(currentProject.client);
    var project = currentProject;
    delete project.implementor;
    delete project.client;
    updateProject(project);

    ipcRenderer.send("reload-parent");
}

function showHistory() {
    historyMenu.style.left = 0;
    blackOverlay.style.opacity = 1;
    blackOverlay.style.zIndex = 90;

    initializeHistoryList();
}

function closeHistory() {
    historyMenu.style.left = '-999px';
    blackOverlay.style.opacity = 0;
    blackOverlay.style.zIndex = -1;
}

function initializeHistoryList() {
    historyList.innerHTML = "";

    var projects = JSON.parse(localStorage.getItem("historyProjects"));

    var i = 1;

    projects.forEach(element => {

        const text = document.createElement("p");
        text.innerText = i + ": " + element.code + " - " + element.client.name;
        if(!JSON.parse(localStorage.getItem("isWorking"))) {
            if(i != 1) {
                text.addEventListener('click', () => {
                    ipcRenderer.send("get-project", element.code);
                    closeHistory();
                })
            }
        }
        
        
        historyList.appendChild(text);
        i++;
    });
    
}