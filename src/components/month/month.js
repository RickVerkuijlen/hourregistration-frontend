const { ipcRenderer, remote } = require('electron');

var today = new Date();

var hours = [];
var totalWork = 0;
var projectList = document.getElementById("projectList");
var employeeList = document.getElementById("employeeList");

document.getElementById("monthPicker").max = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0');

function closeWindow() {
    remote.getCurrentWindow().close();
}



function getHours() {
    hours = [];
    totalWork = 0;

    var value = document.getElementById("monthPicker").value.split("-");
    var year = value[0];
    var month = value[1];
    
    getMonthOverview(month, year)
    .then(res => {
        res.forEach(element => {
            hours.push(element);
        });
        updateList();
    })

    
    
}

function updateList() {
    projectList.innerHTML = "";

    const text = document.createElement("h4");
    text.innerHTML = "Werknummer";
    projectList.appendChild(text);

    

    hours.sort((a, b) => (a.projectId > b.projectId) ? 1 : -1);

    getAllUsers()
    .then(users => {
        var filteredHours = [];
        users.forEach(user => {
            const name = document.createElement("p")
            name.className = "name hour";
            name.innerHTML = user.name;
            projectList.appendChild(name);

            filteredHours.push(hours
            .filter(function (e) {
                return user.userId == e.userId;
            }))
        });
        
        initializeList(storeHours(filteredHours, users));
        
    })
}

function storeHours(filteredHours, users) {
    var result = [];

    
    var totalPerProject = 0;
    for(i = 0; i < users.length; i++) {
        filteredHours[i].forEach(hour => {
            
            var info = {
                projectId: hour.projectId,
                users: []
            }
            if(!result.filter(res => res.projectId == hour.projectId).length || result.length == 0) {
                result.push(info);
            }

            if(result.filter(res => res.projectId == hour.projectId).length) {
                var project = result.filter(res => res.projectId == hour.projectId)[0];
                
                for(j = 0; j < users.length; j++) {
                    var userInfo = {
                        userId: hour.userId,
                        workedHours: hour.workedHours
                    }
    
                    console.log(hour.userId + " ? " + users[j].userId)
    
                    if(userInfo.userId != users[j].userId) {
                        userInfo.userId = users[j].userId;
                        userInfo.workedHours = 0;
                    }

                    console.log(project.users.includes(userInfo))
                
    
                    if(!project.users.includes(userInfo)) {
                        
                        project.users.push(userInfo);
                    }
                }

            }
            totalPerProject += hour.workedHours;

        })
    }

    return result;
}

function initializeList(projects) {
    console.log(projects);
    projects.forEach(project => {
        const outerDiv = document.createElement("div");
        
        const projectCode = document.createElement("h4");
        projectCode.innerHTML = project.projectId;
        outerDiv.appendChild(projectCode);

        project.users.forEach(user => {
            const hourDiv = document.createElement("div");
            hourDiv.id = "user-" + user.userId;
            hourDiv.className = "hour"

            const workedHours = document.createElement("p");
            workedHours.innerHTML = user.workedHours.toFixed(2);

            hourDiv.appendChild(workedHours);
            outerDiv.appendChild(hourDiv);
        });

        
        projectList.appendChild(outerDiv);
    });
}