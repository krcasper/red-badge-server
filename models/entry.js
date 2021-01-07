const {DataTypes} = require('sequelize');
const db = require('../db');

const Entry = db.define('entry', {
    entryName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    entryDate: {
        type: DataTypes.DATE
    },
    entryDescription: {
        type: DataTypes.TEXT,
    },
    user: {
        type: DataTypes.INTEGER
    }
})

module.exports = Entry