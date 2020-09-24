const fs = require('fs');
const { ipcRenderer, remote } = require('electron');

const _baseFolder = "V:\\Tekeningen\\";

var projectList = document.getElementById("projectList")
var amountOfProjects = document.getElementById("amountOfProjects");
var implementorSelect = document.getElementById("searchImplementor");
var projects = [];
var isDisabled = (localStorage.getItem("isWorking") === 'true');

init();

async function init() {
    Promise.all([getAllImplementors(), getAllClients(), getAllProjects()])
    .then(values => {
        values[2].forEach(project => {
            project.client = values[1].filter(x => x.id == project.clientId)[0];
            project.implementor = values[0].filter(x => x.id == project.implementorId)[0];
        });

        initializeList(values[2]);
        projects = values[2];

        values[0].forEach(element => {
            var option = document.createElement("option")
            option.value = element.id;
            option.innerHTML = element.name;
            implementorSelect.appendChild(option);
        });
    })     
}

function initializeList(projects) {
    amountOfProjects.innerHTML = "Aantal projecten: " + projects.length;
    projectList.innerHTML = "";
    projects.sort((a, b) => (a.client.name < b.client.name) ? 1 : -1)
    projects.sort((a, b) => (a.implementor.name < b.implementor.name)? 1 : -1)
    projects.forEach(project => {
        const outerDiv = document.createElement("DIV");
        outerDiv.classList.add("project");

        const implementorName = document.createElement("p")
        implementorName.innerHTML = project.implementor.name;
        implementorName.style.backgroundColor = 'purple';
        implementorName.style.color = "white";
        implementorName.style.whiteSpace = "normal";

        const projectCode = document.createElement("p")
        projectCode.innerHTML = project.code;
        
        const clientName = document.createElement("p");
        clientName.innerHTML = project.client.name;
        
        const clientInitials = document.createElement("p");
        clientInitials.innerHTML = project.client.initials;

        const projectDescription = document.createElement("p");
        projectDescription.innerHTML = project.description;
        
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
            projectDescription.addEventListener("click", function(){sendProject(project.code), false});
            clientCity.addEventListener("click", function(){sendProject(project.code), false});
            lastModified.addEventListener("click", function(){sendProject(project.code), false});
        }
        outerDiv.appendChild(implementorName);
        outerDiv.appendChild(projectCode);
        outerDiv.appendChild(clientName);
        outerDiv.appendChild(clientInitials);
        outerDiv.appendChild(projectDescription);
        outerDiv.appendChild(clientCity);
        outerDiv.appendChild(lastModified);
        outerDiv.appendChild(folderButton);

        projectList.appendChild(outerDiv);
    });
}

function filter() {

    var name = document.getElementById("searchName").value;
    var city = document.getElementById("searchCity").value;
    var code = document.getElementById("searchCode").value;

    projectList.innerHTML = "";
    
    console.log(name + city + code)
    initializeList(
    projects
    .filter(x => x.client.name.toLowerCase().includes(name.toLowerCase())) 
    .filter(x => x.client.city.toLowerCase().includes(city.toLowerCase()))
    .filter(x => x.code.toLowerCase().includes(code.toLowerCase())))
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