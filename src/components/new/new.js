const { ipcRenderer, remote } = require('electron');
const fs = require('fs');
const _baseFolder = "V:\\Tekeningen\\";

function closeWindow() {
    remote.getCurrentWindow().close();
}

var _implementors = [];
var _subFolders = [];
var currentProject = {
    client: {
        company: "",
        name: "",
        initials: "",
        adress: "",
        zipCode: "",
        city: "",
        phone: "",
        email: ""
    },
    code: "",
    description: "",
    particularities: "",
    buildAddress: "",
    buildCity: "",
    buildZipcode: "",
    lastModified: ""

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

    _subFolders = await getAllFolders();
    console.log(_subFolders);
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
            document.getElementById("code").value = checkFolderId(folderId, 1, implementor.initial);
        } else {
            document.getElementById("code").value = checkFolderId(folderId, 1);
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
        currentProject.code = folderId+counter+initial;
        return folderId + counter + initial;
    }
}

async function handleForm(e) {
    e.preventDefault();
    var project = currentProject;
    project.clientId = await createClient(currentProject.client);
    console.log(project);
    delete project.implementor;
    delete project.client;
    if(createProject(project)) {
        console.log("project created");
        // const folderPath = _baseFolder + currentProject.workCode;
        // fs.mkdirSync(folderPath);
    
        // _subFolders.forEach(folder => { //Creates subfolders
        //     fs.mkdirSync(folderPath + "\\" + folder.name)
        // });
        localStorage.setItem("lastProject", JSON.stringify(project));
        // ipcRenderer.send("reload-parent");
        // remote.getCurrentWindow().close();
    } else {
        console.error("Something went wrong");
    }

    
}

function setProjectValue(event) {
    console.log(event);
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