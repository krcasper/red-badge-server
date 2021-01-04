const {DataTypes} = require('sequelize');
const db = require('../db');

const Profile = db.define('profile', {
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

    user: {
        type: DataTypes.INTEGER
    }

})

module.exports = Profile