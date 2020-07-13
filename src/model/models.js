class Project {
    constructor(code, buildAddress, buildCity, buildZipcode, workedHours, description, particularities, lastModified, clientId, implementorId) {
        this.code = code;
        this.buildAddress = buildAddress;
        this.buildCity = buildCity;
        this.buildZipcode = buildZipcode;
        this.workedHours = workedHours;
        this.description = description;
        this.particularities = particularities;
        this.lastModified = lastModified;
        this.clientId = clientId;
        this.implementorId = implementorId;
    }
}

class Implementor {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class Client {
    constructor(id, name, initials, company, address, zipCode, city, phone, email) {
        this.id = id;
        this.name = name;
        this.initials = initials;
        this.company = company;
        this.address = address;
        this.zipCode = zipCode;
        this.city = city;
        this.phone = phone;
        this.email = email;
    }
}

class Hour {
    constructor(projectId, userId, date, workedHours) {
        this.projectId = projectId;
        this.userId = userId;
        this.date = date;
        this.workedHours = workedHours;
    }
}

class User {
    constructor(userId, name, isAdmin, password) {
        this.userId = userId;
        this.name = name;
        this.isAdmin = isAdmin;
        this.password = password;
    }
}