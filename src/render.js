var fs = require('fs');

const testFolder = "V:\\Tekeningen";
var directories = [];
var projects = [];


directories = fs.readdirSync(testFolder, { withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

    var projectDiv = document.getElementById('project');

getAllProjects().then(res => {
   res.forEach(project => {
        var title = document.createElement('H1');
        var text = document.createTextNode(project.code);
        title.innerHTML = project.code;
        projectDiv.appendChild(title);
   })
})