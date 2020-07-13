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

    var passwordButton = document.createElement("BUTTON");
    passwordButton.innerHTML = "Wachtwoord checken";
    passwordButton.addEventListener("click", function(){checkPassword(user), false});

    outerDiv.appendChild(passwordInput);
    outerDiv.appendChild(passwordButton);
}

function checkPassword(user) {
    if(user.password == document.getElementById("password").value) {
        sendToLogin(user);
    }
}

function sendToLogin(user) {
    localStorage.setItem("user", JSON.stringify(user));
    ipcRenderer.send("reload-parent");
    remote.getCurrentWindow().close();
}