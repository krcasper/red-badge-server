const {DataTypes} = require('sequelize');
const db = require('../db');

const Entry = db.define('entry', {
    entryName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    entryDate: {
        type: DataTypes.DATEONLY
    },
    entryDescription: {
        type: DataTypes.TEXT,
    },

    trip: {
        type: DataTypes.INTEGER
    }
})

module.exports = Entry