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

    console.log(hours);

    getAllUsers()
    .then(users => {
        var filteredHours = [];
        users.forEach(user => {
            filteredHours.push(hours
            .filter(function (e) {
                return user.userId == e.userId;
            }))
        });
        
        storeHours(filteredHours, users);
        
    })
}

function storeHours(filteredHours, users) {
    var result = [];

    for(i = 0; i < users.length; i++) {
        filteredHours[i].forEach(hour => {
            var info = {
                projectId: hour.projectId,
                user: [{
                    userId: hour.userId,
                    workedHours: hour.workedHours
                }]
            }
            if(!result.filter(res => res.projectId == hour.projectId).length) {
                result.push(info);
            }

            if(result.filter(res => res.projectId == hour.projectId).length) {
                var project = result.filter(res => res.projectId == hour.projectId)[0];


                for(j = 0; j < project.user.length; j++) {
                    if(project.user[j].userId != hour.userId ) {
                        var userInfo = {
                            userId: hour.userId,
                            workedHours: hour.workedHours
                        }
    
                        project.user.push(userInfo);
                    }
                }
                
            }
            
        })
    }

    console.log(result);

    return result;
}