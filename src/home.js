const { ipcRenderer } = require('electron')
const fs = require('fs');
const _baseFolder = "V:\\Tekeningen\\";


var currentProject;

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

ipcRenderer.on('set-project', (event, args) => {
    getProjectByCode(args).then(project => {
        currentProject = project;
        console.log(currentProject);
        document.getElementById("workCode").value = currentProject.code;
        console.log(currentProject.buildAddress);
    });
    
})
