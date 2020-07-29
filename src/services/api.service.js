const axios = require('axios');

var _baseUrl = "http://localhost:3000/";

async function getAllProjects() {
    return await axios.get(this._baseUrl + "projects")
    .then(response => {
        return response.data.map(project => {
            return new Project(project.code, project.buildAddress, project.buildCity, project.buildZipcode, project.workedHours, project.description, project.particularities, project.lastModified, project.clientId, project.implementorId, project.finances, project.finances_extra)
        });
    });
}

async function getProjectByCode(projectCode) {
    return await axios.get(this._baseUrl + "projects/" + projectCode)
    .then(project => {
        project = project.data
        console.log(project);
        return new Project(project.code, project.buildAddress, project.buildCity, project.buildZipcode, project.workedHours, project.description, project.particularities, project.lastModified, project.clientId, project.implementorId, project.finances, project.finances_extra);
    })
}

async function getClient(clientId) {
    return await axios.get(this._baseUrl + "clients/" + clientId)
    .then(client => {
        client = client.data;
        return new Client(client.id, client.name, client.initials, client.company, client.address, client.zipCode, client.city, client.phone, client.email);
    })
}

async function getImplementor(implementorId) {
    return await axios.get(this._baseUrl + "implementors/" + implementorId)
    .then(implementor => {
        implementor = implementor.data;
        return new Implementor(implementor.id, implementor.name, implementor.initial);
    })
}

async function getAllImplementors() {
    return await axios.get(this._baseUrl + "implementors")
    .then(implementors => {
        console.log(implementors);
        return implementors.data.map(implementor => {
            return new Implementor(implementor.id, implementor.name, implementor.initial);
        })
    })
}

async function saveHour(hour) {
    const headers = {
        'Content-type': 'application/json'
    }
    return await axios.post(this._baseUrl + "hours", JSON.stringify(hour), {headers: headers})
    .then(res => {
        console.log(res);
    })
}

async function updateHour(hour) {
    const headers = {
        'Content-type': 'application/json'
    }
    return await axios.put(this._baseUrl + "hours", JSON.stringify(hour), {headers: headers})
    .then(res => {
        console.log(res);
    })
}

async function getMonthOverview(month, year) {
    return await axios.get(this._baseUrl + "hours/month/" + month + "/" + year)
    .then(hours => {
        if(hours.status == 200) {
            return hours.data.map(hour => {
                return new Hour(hour.projectId, hour.userId, hour.date, hour.workedHours);
            })
        } else {
            return null;
        }
    })
}

async function getWeeklyOverview(week, year) {
    return await axios.get(this._baseUrl + "hours/week/" + week + "/" + year)
    .then(hours => {
        if(hours.status == 200) {
            return hours.data.map(hour => {
                return new Hour(hour.projectId, hour.userId, hour.date, hour.workedHours);
            })
        } else {
            return null;
        }
    })
}

async function getAllUsers() {
    return await axios.get(this._baseUrl + "users")
    .then(users => {
        return users.data.map(user => {
            return new User(user.id, user.name, user.admin);
        })
    })
}


async function getUserById(userId) {
    return await axios.get(this._baseUrl + "users/" + userId)
    .then(user => {
        user = user.data;
        return new User(user.id, user.name, user.admin, user.password);
    })
}

async function updateClient(client) {
    const headers = {
        'Content-type': 'application/json'
    }
    return await axios.put(this._baseUrl + "clients", JSON.stringify(client), {headers: headers})
    .then(res => {
        console.log(res);
    })
}

async function updateProject(project) {
    const headers = {
        'Content-type': 'application/json'
    }
    return await axios.put(this._baseUrl + "projects", JSON.stringify(project), {headers: headers})
    .then(res => {
        console.log(res);
    })
}

async function createProject(project) {
    const headers = {
        'Content-type': 'application/json'
    }
    return await axios.post(this._baseUrl + "projects", JSON.stringify(project), {headers: headers})
    .then(res => {
        console.log(res);
    })
}

async function getAllFolders() {
    return await axios.get(this._baseUrl + "folders")
    .then(res => {
        console.log(res);
        return res.data;
    })
}

async function createProject(project) {
    const headers = {
        'Content-type': 'application/json'
    }
    return await axios.post(this._baseUrl + "projects", JSON.stringify(project), {headers: headers})
    .then(res => {
        console.log(res);
        return res.data;
    })
}

async function createClient(client) {
    const headers = {
        'Content-type': 'application/json'
    }
    return await axios.post(this._baseUrl + "clients", JSON.stringify(client), {headers: headers})
    .then(res => {
        console.log(res);
        return res.data;
    })
}