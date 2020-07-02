const fs = require('fs');
const { ipcRenderer, remote } = require('electron');

var projectList = document.getElementById("projectList")

getAllProjects().then(res => {
    res.forEach(project => {
        getClient(project.clientId)
        .then(client => {
            var button = document.createElement("BUTTON")
            button.addEventListener("click", function(){sendProject(project.code), false});
            button.textContent = project.code;
            projectList.appendChild(button);

            var clientName = document.createElement("p");
            console.log(project);
            clientName.innerHTML = client.name;
            projectList.appendChild(clientName);
        });

        

        
    });
    
})

function sendProject(projectCode) {
    ipcRenderer.send("get-project", projectCode);
    remote.getCurrentWindow().close();
}