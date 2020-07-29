const { ipcRenderer, remote } = require('electron');

var today = new Date();

var hours = [];
var totalWork = 0;
var projects = [];
var implementors = [];
var projectList = document.getElementById("projectList");
document.getElementById("monthPicker").max = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0');

function closeWindow() {
    remote.getCurrentWindow().close();
}

var implementorSelect = document.getElementById('implementorList');
getAllImplementors()
.then(implementors => {
    this.implementors = implementors;
    implementors.forEach(element => {
        var option = document.createElement("option")
        option.value = element.id;
        option.innerHTML = element.name;
        implementorSelect.appendChild(option);
    });
})



async function getHours() {
    hours = [];
    totalWork = 0;

    var value = document.getElementById("monthPicker").value.split("-");
    var year = value[0];
    var month = value[1];
    
    var res = await getMonthOverview(month, year);

    if(res) {
        for (var element of res) {
            var project = await getProjectByCode(element.projectId);
            var client = await getClient(project.clientId);
    
            element.name = client.name;
            element.city = client.city;
            element.description = project.description;
            if(project.implementorId == implementorSelect.value) hours.push(element);
        }
        
        initializeList();
    } else {
        projectList.innerHTML = "";

        const error = document.createElement("h1");
        error.innerHTML = "Geen resultaat gevonden...";
        projectList.appendChild(error);
    }

    
}

function initializeList() {
    document.getElementById('print-pdf').disabled = false;
    projectList.innerHTML = "";

    const infoDiv = document.createElement("div");
    infoDiv.className = "info";
    infoDiv.id = "header"
    

    const code = document.createElement("h4");
    code.innerHTML = "Werknummer";
    infoDiv.appendChild(code);

    const project = document.createElement("h4");
    project.innerHTML = "Project";
    infoDiv.appendChild(project);

    const city = document.createElement("h4");
    city.innerHTML = "Plaats";
    infoDiv.appendChild(city);

    const description = document.createElement("h4");
    description.innerHTML = "Omschrijving";
    infoDiv.appendChild(description);

    projectList.appendChild(infoDiv);


    hours.sort((a, b) => (a.projectId > b.projectId) ? 1 : -1);

    getAllUsers()
    .then(users => {
        users.forEach(user => {
            const name = document.createElement("h4")
            name.className = "info name hour";
            name.id = "header";
            name.innerHTML = user.name;
            projectList.appendChild(name);
        });
        const total = document.createElement("h4");
        total.innerHTML = "Totale uren";
        total.className = "info name hour";
        total.id = "header";
        projectList.appendChild(total);
        updateList(storeHours(hours, users));
        
    })
}

function storeHours(hours, users) {
    var result = [];
    
    hours.forEach(hour => {
        var info = {
            projectId: hour.projectId,
            city: hour.city,
            name: hour.name,
            description: hour.description,
            users: [],
            totalHours: 0
        }

        users.forEach(user => {
            var userInfo = {
                userId: user.userId,
                workedHours: 0
            }

            info.users.push(userInfo)
        });

        if(!result.filter(res => res.projectId == hour.projectId).length || result.length == 0) {
            result.push(info);
        }
    });

    result = setHours(result, hours);
    console.log(result)
    return result;
}

function setHours(result, hours) {
    result.forEach(project => {
        hours.forEach(hour => {
            if(project.projectId == hour.projectId) {
                project.users.forEach(user => {
                    if(hour.userId == user.userId) {
                        user.workedHours = hour.workedHours;
                    }
                });
                project.totalHours += hour.workedHours;
            }
        })
    })

    return result;
}



function updateList(projects) {
    this.projects = projects;
    const scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollable";

    projects.sort((a, b) => (a.name > b.name) ? 1 : -1);

    projects.forEach(project => {
        const outerDiv = document.createElement("div");
        outerDiv.className = "odd-background"
        const infoDiv = document.createElement("div");
        infoDiv.className = "info"
        
        const projectCode = document.createElement("h4");
        projectCode.innerHTML = project.projectId;
        infoDiv.appendChild(projectCode);

        const projectName = document.createElement("span");
        projectName.innerHTML = project.name;
        infoDiv.appendChild(projectName);

        const projectCity = document.createElement("span");
        projectCity.innerHTML = project.city;
        infoDiv.appendChild(projectCity);

        const projectDescription = document.createElement("span");
        projectDescription.innerHTML = project.description;
        projectDescription.title = project.description;
        infoDiv.appendChild(projectDescription);

        outerDiv.appendChild(infoDiv);

        project.users.forEach(user => {
            const hourDiv = document.createElement("div");
            hourDiv.id = "user-" + user.userId;
            hourDiv.className = "hour"

            const workedHours = document.createElement("p");
            workedHours.innerHTML = user.workedHours.toFixed(2);

            hourDiv.appendChild(workedHours);
            outerDiv.appendChild(hourDiv);
        });

        const totalHours = document.createElement("h5");
        totalHours.innerHTML = project.totalHours.toFixed(2);
        totalHours.className = "totalHours";
        outerDiv.appendChild(totalHours);
        
        scrollDiv.appendChild(outerDiv);
    });
    projectList.appendChild(scrollDiv);
}

const printPdf = document.getElementById('print-pdf');

printPdf.addEventListener('click', function(event) {
    var value = document.getElementById("monthPicker").value.split("-");
    var month = value[1] + "-" + value[0];
    printMonthlyOverview(projects, implementors.find(x => x.id == implementorSelect.value).name, month);
})

