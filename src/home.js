const { ipcRenderer } = require('electron')
const fs = require('fs');
require('dotenv').config({path: process.cwd() + '/src/assets/.env'})
const _baseFolder = process.env.PROJECTS_URL;

var currentProject;
var startTime;

var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");
let workedHours = 0;
var isWorking = false;
var inputs = document.forms['projectInfo'].querySelectorAll('input, select, textarea');

window.onload = (event) => {
    var project = JSON.parse(localStorage.getItem("lastProject"));
    this.currentProject = project;
    if(project) {
        initialize(project);
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
}

function calculateHours(workTime) {
    var timeInSeconds = ((workTime % 60000) / 1000).toFixed(0);

    var decimal = timeInSeconds * (1 / 3600);

    console.log(decimal);

    let today = new Date();

    today = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

    console.log(today);

    var hour = new Hour(currentProject.code, today, decimal);

    saveHour(hour);

}

function disableInputs() {
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }
}

function enableInputs() {
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
    }
}


var implementorSelect = document.getElementById('implementorList');
getAllImplementors()
.then(implementors => {
    console.log(implementors)
    implementors.forEach(element => {
        var option = document.createElement("option")
        option.value = element.id;
        option.innerHTML = element.name;
        implementorSelect.appendChild(option);
    });
})


ipcRenderer.on('set-project', (event, args) => {
    getProjectByCode(args)
    .then(project => {
        getClient(project.clientId)
        .then(client => {
            getImplementor(project.implementorId)
            .then(implementor => {
                console.log(implementor)
                currentProject = project;
                currentProject.client = client;
                currentProject.implementor = implementor;
                initialize(currentProject);
                localStorage.setItem("lastProject", JSON.stringify(currentProject));
            })
            
        });
        
    });
})

function initialize(currentProject) {
    console.log(currentProject);
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
    document.getElementById("buildAddress").value = currentProject.buildAddress;
}
