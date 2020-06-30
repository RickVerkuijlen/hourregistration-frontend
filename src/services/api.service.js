require('dotenv').config({path: __dirname + '/assets/.env'})
const axios = require('axios');

var _baseUrl = process.env.API_URL;

async function getAllProjects() {
    return await axios.get(this._baseUrl + "projects")
    .then(response => {
        return response.data;
    });
}


