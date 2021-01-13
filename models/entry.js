const {DataTypes} = require('sequelize');
const db = require('../db');

const Entry = db.define('entry', {
    entryName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    entryDate: {
        type: DataTypes.STRING
    },
    entryDescription: {
        type: DataTypes.STRING,
    }
})

module.exports = Entry