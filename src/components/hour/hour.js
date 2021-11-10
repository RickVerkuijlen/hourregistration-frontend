const { ipcRenderer, remote } = require('electron');

var today = new Date();

function closeWindow() {
    remote.getCurrentWindow().close();
}

window.onload = async() => {
    getHours();
    
}


async function getHours() {
    loader.style.display = "block";
    projectList.innerHTML = "";

    hours = [];
    totalWork = 0;

    projectId = JSON.parse(localStorage.getItem("lastProject")).code;
    console.log(projectId)
    document.getElementById("projectId").textContent = projectId;
    
    var res = await getHourOverview(projectId);

    console.log(res);

    if(res) {
        for (var element of res) {
            var user = await getUserById(element.userId);
    
            element.user = user.name;
            this.totalWork += element.workedHours;
        }

        this.hours = res;
        
        initializeList();
    } else {
        const error = document.createElement("h1");
        error.innerHTML = "Geen resultaat gevonden...";
        projectList.appendChild(error);
    }

    
}

function initializeList() {
    // document.getElementById('print-pdf').disabled = false;
    projectList.innerHTML = "";

    const infoDiv = document.createElement("div");
    infoDiv.className = "info";
    infoDiv.id = "header"
    

    const date = document.createElement("h4");
    date.innerHTML = "Datum";
    infoDiv.appendChild(date);

    const user = document.createElement("h4");
    user.innerHTML = "Tekenaar";
    infoDiv.appendChild(user);

    const workedHours = document.createElement("h4");
    workedHours.innerHTML = "Gewerkte uren";
    infoDiv.appendChild(workedHours);

    projectList.appendChild(infoDiv);


    hours.sort((a, b) => (a.projectId > b.projectId) ? 1 : -1);

    updateList(hours);
}

function updateList(hours) {

    this.hours = hours;
    const scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollable";

    hours.sort((a, b) => (a.date < b.date) ? 1 : -1);

    console.log(this.hours)

    hours.forEach(project => {
        const outerDiv = document.createElement("div");
        outerDiv.className = "odd-background"
        const infoDiv = document.createElement("div");
        infoDiv.className = "info"
        
        const projectCode = document.createElement("h4");
        projectCode.innerHTML = ('0' + new Date(project.date).getDate()).slice(-2) + "-" + ('0' + new Date(project.date).getMonth()).slice(-2) + "-" + new Date(project.date).getFullYear();
        infoDiv.appendChild(projectCode);

        const projectName = document.createElement("span");
        projectName.innerHTML = project.user;
        infoDiv.appendChild(projectName);

        const projectCity = document.createElement("span");
        projectCity.innerHTML = project.workedHours;
        infoDiv.appendChild(projectCity);

        outerDiv.appendChild(infoDiv);
        
        scrollDiv.appendChild(outerDiv);
    });
    projectList.appendChild(scrollDiv);
    loader.style.display = "none"; 
    document.getElementById("totaal").textContent = this.totalWork;
}

