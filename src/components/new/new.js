const { ipcRenderer, remote } = require('electron');
const fs = require('fs');
const _baseFolder = "V:\\Tekeningen\\";

function closeWindow() {
    remote.getCurrentWindow().close();
}

var _implementors = [];
var _folders = [];
var currentProject = {
    client: {
        
    },
    

};

window.onload = async () => {
    var implementorSelect = document.getElementById('implementorList');
    await getAllImplementors()
    .then(implementors => {
        console.log(implementors)
        implementors.forEach(element => {
            var option = document.createElement("option")
            option.value = element.id;
            option.innerHTML = element.name;
            implementorSelect.appendChild(option);
            _implementors.push(element);
        });
    })

    _folders = await getAllFolders();
    console.log(_folders);
}


function createFolderId() {
    var lastName = document.getElementById("name").value.toUpperCase();
    var city = document.getElementById("city").value.toUpperCase();
    var implementor = _implementors.filter(x => x.id == document.getElementById("implementorList").value)[0];

    console.log(lastName)
    console.log(city)
    console.log(implementor);

    if(lastName != "" && city != "") {
        
        var folderId = new Date().getFullYear().toString().substr(-2) + lastName[0] + city[0]

        if(implementor.initial) {
            document.getElementById("workCode").value = checkFolderId(folderId, 1, implementor.initial);
        } else {
            document.getElementById("workCode").value = checkFolderId(folderId, 1);
        }
    }

    
}

function checkFolderId(folderId, counter, initial) {
    if(initial == undefined) {
        initial = "";
    }
    console.log(folderId + counter + initial);
    if(fs.existsSync(_baseFolder + folderId + counter + initial)) {
        counter++;
        return checkFolderId(folderId, counter, initial);
    } else {
        console.log("real id:" + folderId + counter + initial)
        currentProject.workCode = folderId+counter+initial;
        return folderId + counter + initial;
    }
}

function handleForm(e) {
    const folderPath = _baseFolder + currentProject.workCode;
    fs.mkdirSync(folderPath);

    _folders.forEach(folder => {
        fs.mkdirSync(folderPath + "\\" + folder.name)
    });
}

function setProjectValue(event) {
    var multi = event.name.split(".")
    eventName = multi[0];

    console.log(multi);

    if(eventName == "client") {
        currentProject.client[multi[1]] = event.value
    } else {
        currentProject[event.name] = event.value;
    }

    console.log(currentProject);
}