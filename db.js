const {Sequelize} = require('sequelize');
// {Sequelize} in curlies is called Object Deconstructuring
// look back on Array Destructuring notes from Gold Badge

// to complete the parameters for new Sequelize(), we created a 'DB_CONNECTION_STRING' in the .env file. This way, we won't have to put our personal Postgres password into our code where everyone can see it
const db = new Sequelize(process.env.DB_CONNECTION_STRING);

module.exports = db;