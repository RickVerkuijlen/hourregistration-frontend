const { ipcRenderer, remote } = require('electron');
const fs = require('fs');
const _baseFolder = "V:\\Tekeningen\\";

function closeWindow() {
    remote.getCurrentWindow().close();
}

function createFolderId() {
    var lastName = document.getElementById("lastName").value.toUpperCase();
    var city = document.getElementById("city").value.toUpperCase();

    console.log(lastName)
    console.log(city)

    if(lastName != "" && city != "") {
        var folderId = new Date().getFullYear().toString().substr(-2) + lastName[0] + city[0]

        document.getElementById("projectId").value = checkFolderId(folderId, 1);
    }

    
}

function checkFolderId(folderId, counter) {
    console.log(folderId + counter);
    if(fs.existsSync(_baseFolder + folderId + counter)) {
        counter++;
        return checkFolderId(folderId, counter);
    } else {
        console.log("real id:" + folderId + counter)
        return folderId + counter;
    }
}