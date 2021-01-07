const {DataTypes} = require('sequelize');
const db = require('../db');

const Trip = db.define('trip', {
    tripName: {
        type: DataTypes.STRING,
        allowNull:  false
    },
    tripDescription: {
        type: DataTypes.STRING,
    },
    tripMembers: {
        type: DataTypes.STRING
    },

    owner: {
        type: DataTypes.INTEGER
    }
})

module.exports = Trip