const {DataTypes} = require('sequelize');
const db = require('../db');

const Profile = db.define('profile', {
    firstName: {
        type: DataTypes.STRING,
    },
    
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    aboutMe: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
    placesVisited: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
    travelGoals: {
        type: DataTypes.STRING,
        allowNull: true
    },

    owner: {
        type: DataTypes.INTEGER
    }

})

module.exports = Profile