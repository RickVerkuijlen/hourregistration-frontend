var fs = require('fs');
const { remote } = require('electron');
const { Menu } = remote;

// const { getAllProjects }  = require('./services/api.service.js');

const testFolder = "V:\\Tekeningen";
const nogTest = "C:/Users/rickv/Desktop";
var directories = [];

document.getElementById('showDirs').addEventListener("click", function() {
    fs.mkdir(nogTest + "/test", { recursive: true}, (err) => {
        err ? console.log(err) : null
    })
});



fs.readdirSync(testFolder).forEach(file => {
    console.log(file);
    directories.push(file);
})


const directoriesMenu = Menu.buildFromTemplate(
    directories.map(file => {
        console.log(file);
        return {
            label: file,
            click: () => selectSource()
        }
    })
)

console.log(getAllProjects());
