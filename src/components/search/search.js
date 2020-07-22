const fs = require('fs');
const { ipcRenderer, remote } = require('electron');

const _baseFolder = "V:\\Tekeningen\\";

var projectList = document.getElementById("projectList")
var amountOfProjects = document.getElementById("amountOfProjects");
var projects = [];
getAllProjects().then(res => {
    res.forEach(project => {
        getClient(project.clientId)
        .then(client => {
            getImplementor(project.implementorId)
            .then(implementor => {
                project.client = client;
                project.implementor = implementor;
                initializeList(project);
                projects.push(project);
            })
            
        });
        
    });
    amountOfProjects.innerHTML += res.length;
})
var isDisabled = (localStorage.getItem("isWorking") === 'true');

function initializeList(project) {

    const outerDiv = document.createElement("DIV");
    outerDiv.classList.add("project");

    const implementorName = document.createElement("p")
    implementorName.innerHTML = project.implementor.name;
    implementorName.style.backgroundColor = 'purple';
    implementorName.style.color = "white";

    const projectCode = document.createElement("p")
    projectCode.innerHTML = project.code;
    
    const clientName = document.createElement("p");
    clientName.innerHTML = project.client.name;
    
    const clientInitials = document.createElement("p");
    clientInitials.innerHTML = project.client.initials;
    
    const clientCity = document.createElement("p");
    clientCity.innerHTML = project.client.city;
    
    const lastModified = document.createElement("p");
    date = new Date(project.lastModified);
    lastModified.innerHTML = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    
    const folderButton = document.createElement("i");
    folderButton.addEventListener("click", function(){openFolder(project.code), false});
    folderButton.className = "folder";
    folderButton.title = "Open project " + project.code;

    const folder = document.createElement("i");
    folder.className = "fas fa-folder";

    const folderOpen = document.createElement("i");
    folderOpen.className = "fas fa-folder-open";

    folderButton.appendChild(folder);
    folderButton.appendChild(folderOpen)

    if(!isDisabled) {
        implementorName.addEventListener("click", function(){sendProject(project.code), false});
        projectCode.addEventListener("click", function(){sendProject(project.code), false});
        clientName.addEventListener("click", function(){sendProject(project.code), false});
        clientInitials.addEventListener("click", function(){sendProject(project.code), false});
        clientCity.addEventListener("click", function(){sendProject(project.code), false});
        lastModified.addEventListener("click", function(){sendProject(project.code), false});
    }
    outerDiv.appendChild(implementorName);
    outerDiv.appendChild(projectCode);
    outerDiv.appendChild(clientName);
    outerDiv.appendChild(clientInitials);
    outerDiv.appendChild(clientCity);
    outerDiv.appendChild(lastModified);
    outerDiv.appendChild(folderButton);

    projectList.appendChild(outerDiv);
}

function filter() {

    var name = document.getElementById("searchName").value;
    var city = document.getElementById("searchCity").value;
    var code = document.getElementById("searchCode").value;

    projectList.innerHTML = "";
    
    console.log(name + city + code)
    projects
    .filter(x => x.client.name.toLowerCase().includes(name.toLowerCase())) 
    .filter(x => x.client.city.toLowerCase().includes(city.toLowerCase()))
    .filter(x => x.code.toLowerCase().includes(code.toLowerCase()))
    .forEach(project => {
        console.log(project)
        initializeList(project);
    })

}

function sendProject(projectCode) {
    ipcRenderer.send("get-project", projectCode);
    closeWindow();
}

function openFolder(projectCode) {
    require('child_process').exec('start "" ' + _baseFolder + projectCode);
}

function closeWindow() {
    remote.getCurrentWindow().close();
}