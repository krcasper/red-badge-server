require('dotenv').config();

const express = require('express');
const db = require('./db');

const app = express();

const controllers = require('./controllers');

app.use(express.json());
app.use(require("./middleware/headers"));
app.use('/users', controllers.usercontroller);
app.use('/trip', controllers.tripcontroller);
// app.use('/profile', controllers.profilecontroller); NOT IN USE
app.use('/entry', controllers.entrycontroller);

// The following line of code db.authenticate() sets up our link to our database and takes in a Promise function. We then use .then as our "promise resolver":
db.authenticate()
.then(() => db.sync()) //where we will pass in -> {force: true} when we need to reset our database
.then(() => {
    app.listen(process.env.PORT, () => console.log(`[Sever:] App is listening on ${process.env.PORT}`));
    })
    .catch((err) => {
        console.log('[Server: ] Server Crashed');
        console.error(err);
    })