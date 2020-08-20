const { ipcRenderer, remote } = require('electron');

var today = new Date();

var days = ["ma", "di", "wo", "do", "vr"];
var daysWorked = [{
    day: "ma",
    workedHours: 0
},
{
    day: "di",
    workedHours: 0
},
{
    day: "wo",
    workedHours: 0
},
{
    day: "do",
    workedHours: 0
},
{
    day: "vr",
    workedHours: 0
},
{
    day: "total",
    workedHours: 0
}]

var hours = [];
var projectList = document.getElementById("projectList");

var addableProjects = document.getElementById("addableProjects");
addableProjects.style.display = "none";
var overview;
document.getElementById("weekPicker").max = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + today.getDate();

function closeWindow() {
    remote.getCurrentWindow().close();
}

async function getHours() {
    hours = [];
    totalWork = 0;

    var value = document.getElementById("weekPicker").value.split("-W");
    var year = value[0];
    var week = value[1];
    
    var res = await getWeeklyOverview(week, year);


    res = res.filter(x => x.userId == JSON.parse(localStorage.getItem("user")).userId);

    if(res.length != 0 || res != null) {
        for (var element of res) {
            var project = await getProjectByCode(element.projectId);
            var client = await getClient(project.clientId);
            var implementor = await getImplementor(project.implementorId);


            element.name = client.name;
            element.city = client.city;
            element.description = project.description;
            element.implementor = implementor.name;
            hours.push(element);
        }
    
        initializeList();
        addableProjects.style.display = "block";
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
    
    const implementor = document.createElement("h4");
    implementor.innerHTML = "Bureau";
    infoDiv.appendChild(implementor);

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

    for(i = 0; i < 5; i++) {
        const weekDay = document.createElement("h4");
        var weekDate = new Date(hours[0].date);
        while(weekDate.getDay() != 1) { // Always show the week from monday through friday
            weekDate.setDate(weekDate.getDate() - 1);
        }
        weekDate.setDate(weekDate.getDate() + i);
        weekDay.className = "info week-day";
        weekDay.id = "header"
        weekDay.innerHTML = days[i] + " " + weekDate.getDate() + "-" + (weekDate.getMonth() + 1)
        projectList.appendChild(weekDay);
    }

    const total = document.createElement("h4");
    total.innerHTML = "Totale uren";
    total.className = "info week-day hour";
    total.id = "header";
    projectList.appendChild(total);

    updateList(storeHours(hours));
}

function storeHours(hours) {
    var result = [];
    
    hours.forEach(hour => {
        var info = {
            implementor: hour.implementor,
            projectId: hour.projectId,
            city: hour.city,
            name: hour.name,
            description: hour.description,
            week: [],
            totalHours: 0
        }

        
        for(i = 0; i < 5; i++) {
            var weekDate = new Date(hours[0].date);
            while(weekDate.getDay() != 1) { // Always show the week from monday through friday
                weekDate.setDate(weekDate.getDate() - 1);
            }
            weekDate.setDate(weekDate.getDate() + i);
            
            var dayInfo = {
                date: weekDate,
                workedHours: 0
            }        

            info.week.push(dayInfo)
        }

        if(!result.filter(res => res.projectId == hour.projectId).length || result.length == 0) {
            result.push(info);
        }
    });
    result = setHours(result, hours);
    overview = result;
    return result;
}

function setHours(result, hours) {
    result.forEach(project => {
        hours.forEach(hour => {
            project.week.forEach(day => {
                if(new Date(day.date).getDate() == new Date(hour.date).getDate() && hour.projectId == project.projectId) {
                    day.workedHours = hour.workedHours
                    project.totalHours += hour.workedHours;
                }
            });
        })
    })
    return result;
}

function updateList(projects) {
    const scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollable";
    
    projects.sort((a, b) => (a.name > b.name) ? 1 : -1);

    projects.forEach(project => {
        const outerDiv = document.createElement("div");
        outerDiv.className = "odd-background"
        const infoDiv = document.createElement("div");
        infoDiv.className = "info"

        const projectImplementor = document.createElement("span");
        projectImplementor.innerHTML = project.implementor;
        infoDiv.appendChild(projectImplementor);
        
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

        var i = 0;
        project.week.forEach(day => {
            const hourDiv = document.createElement("div");
            hourDiv.id = "day-" + project.projectId;
            hourDiv.className = "week-day day-"+days[i]+" input"

            const workedHours = document.createElement("input");
            workedHours.type = "number";
            workedHours.className = "hour-input";
            workedHours.name = day.date.getFullYear() + '-' + ('0' + (day.date.getMonth()+1)).slice(-2) + '-' + ('0' + day.date.getDate()).slice(-2) + "/" + project.projectId;
            workedHours.value = day.workedHours.toFixed(2);
            workedHours.setAttribute("step", ".25");
            workedHours.setAttribute("min", "0");
            workedHours.addEventListener("focusout", () => {
                updateHours(workedHours);
            })

            hourDiv.appendChild(workedHours);
            outerDiv.appendChild(hourDiv);

            i++;
        });

        const totalHours = document.createElement("h5");
        totalHours.innerHTML = project.totalHours.toFixed(2);
        totalHours.className = "totalHours";
        outerDiv.appendChild(totalHours);
        
        scrollDiv.appendChild(outerDiv);
    });

    calculateTotalHours();

    const outerDiv = document.createElement("div");
    outerDiv.className = "odd-background"

    daysWorked.forEach(day => {
        const time = document.createElement("b");
        time.className = "week-day total-sum";
        time.innerText = day.workedHours.toFixed(2);
        outerDiv.appendChild(time);
    })

    scrollDiv.appendChild(outerDiv);

    projectList.appendChild(scrollDiv);

    
}

function updateHours(input) {
    input.value = parseFloat(input.value).toFixed(2)

    var value = input.name.split("/");
    var today = new Date(value[0]);

    today = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    var projectId = value[1];

    var hour = new Hour(projectId, JSON.parse(localStorage.getItem("user")).userId, today, input.value);

    updateHour(hour)
}

function calculateTotalHours() {
    for(i = 0; i < 5; i++) {
        var dayWorked = 0;
        overview.forEach(element => {
            dayWorked += element.week[i].workedHours;
        });
        daysWorked[i].workedHours = dayWorked;
        daysWorked[daysWorked.length - 1].workedHours += daysWorked[i].workedHours;
    }
}

async function loadNewProjects() {
    Promise.all([getAllImplementors(), getAllClients(), getAllProjects()])
    .then(values => {
        values[2].forEach(project => {
            project.client = values[1].filter(x => x.id == project.clientId)[0];
            project.implementor = values[0].filter(x => x.id == project.implementorId)[0];
            
        });
        createSearchList(values[2]);
    });
    
}

function createSearchList(projects) {
    var div = document.getElementById("allProjects");

    div.innerHTML = "";

    projects.sort((a, b) => (a.client.name < b.client.name) ? 1 : -1)
    projects.sort((a, b) => (a.implementor.name < b.implementor.name)? 1 : -1)

    projects.forEach(project => {
        var content = document.createElement("div");
        content.className = "projectSearch";
        content.setAttribute("for", project.code);
        content.addEventListener("click", () => {
            addProjectToOverview(project);
        });

        var implementor = document.createElement("span");
        implementor.innerHTML = project.implementor.name;
        content.appendChild(implementor);

        var projectName = document.createElement("span");
        projectName.innerHTML = project.client.name;
        content.appendChild(projectName);

        var initials = document.createElement("span");
        initials.innerHTML = project.client.initials;
        content.appendChild(initials);

        var code = document.createElement("span");
        code.innerHTML = project.code;
        content.appendChild(code);

        var city = document.createElement("span");
        city.innerHTML = project.client.city;
        content.appendChild(city);

        var modified = document.createElement("span");
        date = new Date(project.lastModified);
        modified.innerHTML = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();   
        content.appendChild(modified);

        div.appendChild(content);
    });
}

async function addProjectToOverview(project) {
    var newProject = new Hour(project.code, JSON.parse(localStorage.getItem("user")).userId, project.date, 0);
    var project = await getProjectByCode(newProject.projectId);
    var client = await getClient(project.clientId);
    var implementor = await getImplementor(project.implementorId);

    newProject.name = client.name;
    newProject.city = client.city;
    newProject.description = project.description;
    newProject.implementor = implementor.name;
    hours.push(newProject);

    initializeList();
}

function generatePDF() {
    printWeeklyOverview(overview);
}