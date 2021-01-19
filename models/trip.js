const {DataTypes} = require('sequelize');
const db = require('../db');

const Trip = db.define('trip', {
    tripName: {
        type: DataTypes.STRING,
        allowNull:  false
    },
    tripDestination: {
        type: DataTypes.STRING,
    },
    tripStartDate: {
        type: DataTypes.STRING
    },
    tripEndDate: {
        type: DataTypes.STRING
    },
    tripDescription: {
        type: DataTypes.STRING,
    }
})

module.exports = Trip