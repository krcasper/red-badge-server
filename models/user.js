
const {DataTypes} = require('sequelize');
const db = require('../db');

const User = db.define('user', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    username: { //# NOTE - ADD CODE TO MAKE USERNAMES NON-CASE-SENSITIVE!
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    checkAdmin: {
        type: DataTypes.BOOLEAN
    },
})

module.exports = User



