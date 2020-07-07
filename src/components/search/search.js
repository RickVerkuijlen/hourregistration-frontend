const fs = require('fs');
require('dotenv').config({path: process.cwd() + '/src/assets/.env'})
const { ipcRenderer, remote } = require('electron');

const _baseFolder = process.env.PROJECTS_URL;

var projectList = document.getElementById("projectList")
var isDisabled = (localStorage.getItem("isWorking") === 'true');
console.log(isDisabled);

getAllProjects().then(res => {
    res.forEach(project => {
        getClient(project.clientId)
        .then(client => {
            const projectButton = document.createElement("BUTTON")
            projectButton.addEventListener("click", function(){sendProject(project.code), false});
            projectButton.disabled = isDisabled;
            projectButton.textContent = project.code;
            projectList.appendChild(projectButton);

            var clientName = document.createElement("p");
            clientName.innerHTML = client.name;
            projectList.appendChild(clientName);

            const folderButton = document.createElement("BUTTON");
            folderButton.addEventListener("click", function(){openFolder(project.code), false});
            folderButton.textContent = "Open projectfolder";
            projectList.appendChild(folderButton);

            
        });
        
    });
    
})



function sendProject(projectCode) {
    ipcRenderer.send("get-project", projectCode);
    remote.getCurrentWindow().close();
}

function openFolder(projectCode) {
    require('child_process').exec('start "" ' + _baseFolder + projectCode);
}