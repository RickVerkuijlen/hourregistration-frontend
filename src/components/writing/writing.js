const { remote } = require('electron');
const exec = require("child_process").exec;

var project = JSON.parse(localStorage.getItem("lastProject"))
var copyButton = document.getElementById("copyData");
const dayNames = ["maandag", 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];


window.onload = () => {
    var initials = "";
    var salutation = "";
    if(project.client.initials) {
        initials = project.client.initials + " ";
    }
    if(project.client.company) {
        salutation = "T.A.V. "
    }
    document.getElementById("company").value = project.client.company;
    document.getElementById("name").value = salutation + initials + project.client.name;
    document.getElementById("address").value = project.client.address;
    document.getElementById("zipcode").value = project.client.zipCode + " " + project.client.city;
    document.getElementById("subject").value = project.description + " " + project.buildAddress + " " + project.buildCity;

    document.getElementById("letter").addEventListener('submit', (event) => {
        event.preventDefault();
    })

    var today = new Date();

    document.getElementById("todayDate").value = dayNames[today.getDay() - 1] + " " + today.getDate() + " " + monthNames[today.getMonth()] + " " + today.getFullYear();
}

function closeWindow() {
    remote.getCurrentWindow().close();
}

function copyData() {
    var company = document.getElementById("company").value;
    var name = document.getElementById("name").value;
    var address = document.getElementById("address").value;
    var zipcode = document.getElementById("zipcode").value;
    
    var dummy = document.createElement("textarea");

    dummy.setAttribute("id", "dummy_id");
    dummy.innerHTML = company + "\n" + name + '\n' + address + '\n' + zipcode;

    document.body.appendChild(dummy);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    showPopup();
}

function showPopup() {
    var popUp = document.getElementById('popUp')
    popUp.style.visibility = "visible";
    popUp.style.opacity = 1;
    setTimeout(function() { 
        popUp.style.visibility = "hidden";
        popUp.style.opacity = 0;
    }, 3000)
}


function submitLetter() {
    console.log("asdf");
}