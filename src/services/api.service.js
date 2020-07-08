const axios = require('axios');

var _baseUrl = "http://localhost:3000/";

async function getAllProjects() {
    return await axios.get(this._baseUrl + "projects")
    .then(response => {
        return response.data.map(project => {
            return new Project(project.code, project.buildAddress, project.buildCity, project.buildZipcode, project.workedHours, project.description, project.particularities, project.lastModified, project.clientId, project.implementorId)
        });
    });
}

async function getProjectByCode(projectCode) {
    return await axios.get(this._baseUrl + "projects/" + projectCode)
    .then(project => {
        project = project.data
        return new Project(project.code, project.buildAddress, project.buildCity, project.buildZipcode, project.workedHours, project.description, project.particularities, project.lastModified, project.clientId, project.implementorId);
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
        return new Implementor(implementor.id, implementor.name);
    })
}

async function getAllImplementors() {
    return await axios.get(this._baseUrl + "implementors")
    .then(implementors => {
        return implementors.data.map(implementor => {
            return new Implementor(implementor.id, implementor.name);
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

