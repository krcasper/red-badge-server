const Trip = require('./trip');
const User = require('./user');
const Profile = require('./profile');

module.exports = {Trip, User, Profile}

/*

NEW USER JSON:

{
    "firstName": 
    "lastName": 
    "email": 
    "username": 
    "password": 
}

NEW PROFILE JSON:

{
    "aboutMe": 
    "placesVisited": 
    "travelGoals":
}

NEW TRIP JSON:

{
    "tripName": 
    "tripDescription": 
    "tripMembers": 
}


*/