const { ipcRenderer } = require('electron')
const fs = require('fs');
const _baseFolder = "V:\\Tekeningen\\";

var currentProject;
var startTime;

var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");
let workedHours = 0;
var isWorking = false;

window.onload = (event) => {
    var project = JSON.parse(localStorage.getItem("lastProject"));
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
    require('child_process').exec('start "" ' + _baseFolder + this.currentProject.code);
}

function startHours() {
    startTime = new Date().getTime();
    console.log("Started on " + startTime)
    isWorking = true;
    localStorage.setItem("isWorking", isWorking);
    startButton.disabled = true;
    stopButton.disabled = false;
}

function stopHours() {
    var workTime = new Date().getTime() - startTime;
    console.log("Gewerkte minuten: " + Math.ceil(workTime / 60000))
    isWorking = false;
    localStorage.setItem("isWorking", isWorking);
    startButton.disabled = false;
    stopButton.disabled = true;
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
