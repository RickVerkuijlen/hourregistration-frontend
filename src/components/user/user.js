const { ipcRenderer, remote } = require('electron');

var userSelect = document.getElementById("userList");

getAllUsers().then(res => {
    console.log(res);
    res.forEach(element => {
        var option = document.createElement("option")
        console.log(element);
        option.value = element.userId;
        option.innerHTML = element.name;
        userSelect.appendChild(option);
    });
})

function login() {
    console.log(userSelect);
    getUserById(userSelect.value).then(res => {
        console.log(res);
        if(res.isAdmin) {
            passwordPopup(res);
        } else {
            sendToLogin(res);
        }
    })
}

function passwordPopup(user) {
    var outerDiv = document.getElementById("login");

    var passwordInput = document.createElement("INPUT");
    passwordInput.setAttribute("type", "password");
    passwordInput.setAttribute("name", "password");
    passwordInput.setAttribute("placeholder", "Wachtwoord");
    passwordInput.id = "password";
    passwordInput.addEventListener("keyup", function(event){
        if(event.keyCode === 13) {
            checkPassword(user)
        }
    }, true);

    var passwordButton = document.createElement("BUTTON");
    passwordButton.innerHTML = "Wachtwoord checken";
    passwordButton.addEventListener("click", function(){checkPassword(user), false});
    

    outerDiv.appendChild(passwordInput);
    outerDiv.appendChild(passwordButton);
}

function checkPassword(user) {
    if(user.password == document.getElementById("password").value) {
        sendToLogin(user);
    } else {
        showTimeWarning();
    }
}

function sendToLogin(user) {
    localStorage.setItem("user", JSON.stringify(user));
    ipcRenderer.send("reload-parent");
    remote.getCurrentWindow().close();
}

function showTimeWarning() {
    var timeWarning = document.getElementById('timeWarning')
    timeWarning.style.visibility = "visible";
    timeWarning.style.opacity = 1;
    setTimeout(function() { 
        timeWarning.style.visibility = "hidden";
        timeWarning.style.opacity = 0;
    }, 3000)
}