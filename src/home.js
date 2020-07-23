const { ipcRenderer, dialog } = require('electron')
const fs = require('fs');
require('dotenv').config({path: process.cwd() + '/src/assets/.env'})
const _baseFolder = "V:\\Tekeningen\\";

var currentProject;
var startTime;

var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");
var isWorking = false;
var inputs = document.forms['projectInfo'].querySelectorAll('input, select, textarea');
var user = JSON.parse(localStorage.getItem("user"));



window.onload = async () => {
    var implementorSelect = document.getElementById('implementorList');
    await getAllImplementors()
    .then(implementors => {
        console.log(implementors)
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

        var finances = document.getElementById("finances-tab-button");

        if(user.isAdmin) {
            finances.style.display = "inline-block";
        } else {
            finances.parentNode.removeChild(finances);
        }
        var project = JSON.parse(localStorage.getItem("lastProject"));
        this.currentProject = project;
        if(this.currentProject) {
            initialize(this.currentProject );
        } else {
            ipcRenderer.send('to-search')
        }
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

        console.log(decimal);

        let today = new Date();

        today = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

        console.log(today);

        var hour = new Hour(currentProject.code, user.userId, today, decimal);

        console.log(hour);

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
}

function enableInputs() {
    document.getElementById("userWelcome").onclick = () => {return changeUser();}
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].disabled = false;
    }
    document.getElementById("updateButton").disabled = false;
}


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

function changeUser() {
    localStorage.removeItem("user");
    ipcRenderer.send("reload-parent");
}

function initialize(currentProject) {
    console.log(currentProject.implementor.id);
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
    document.getElementById("buildAddress").value = currentProject.buildAddress;
}

function changeProjectValue(event) {
    var multi = event.name.split(".")
    console.log(currentProject);
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