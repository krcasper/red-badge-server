const Trip = require('./trip');
const User = require('./user');
const Profile = require('./profile');
const Entry = require('./entry');

User.hasOne(Profile);
Profile.belongsTo(User)

User.hasMany(Trip);
Trip.belongsTo(User)

Trip.hasMany(Entry);
Entry.belongsTo(Trip)

module.exports = {Trip, User, Profile, Entry}

/*

NEW USER JSON:

{
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