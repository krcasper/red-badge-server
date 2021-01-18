const express = require('express');
const router = express.Router();
const {User} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let {roles} = require('../roles');
const AccessControl = require('accesscontrol')
const validateSession = require('../middleware/validate-session');

const { UniqueConstraintError } = require('sequelize/lib/errors');

// --> GET ALL USERS (ADMIN)
router.get('/', validateSession, (req, res) => {
    User.findAll() 
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({
        error: err
    }))
});

// --> GET USER BY USERNAME
router.get("/:username", validateSession, (req, res) => {
    User.findOne({ where: { username: req.params.username } })
      .then((user) => res.status(200).json(user))
      .catch((err) => res.status(500).json({ error: err }));
});

// --> CREATE NEW USER

//# ORIGINAL CODE - UNCOMMENT IF REVERTING TO MASTER
router.post('/register', function(req, res) {

    User.create({
        email: req.body.email,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 13),
        role: req.body.role || "user"
    })
        .then(
            function createSuccess(user) {
                let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
                res.json({
                    user: user,
                    message: 'User successfully created!',
                    sessionToken: token
                });
            }  
        )
        .catch(err => res.status(500).json({ error: err }))
});

// --> USER LOGIN:
router.post('/login', function(req, res) {
    console.log(req.body)
    User.findOne({
        where: {
            username: req.body.username
        }
})
    .then(function loginSuccess(user) {
        if (user) {
            bcrypt.compare(req.body.password, user.password, function (err, matches) {
                if (matches) {

                    let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })

                    res.status(200).json({
                        user: user,
                        message: "User successfully logged in!",
                        sessionToken: token
                    })
                } else {
                    res.status(502).send({ error: "Login Failed" });
                }
            });
        } else {
            res.status(500).json({ error: 'User does not exist.'})
        }
    })
    .catch(err => res.status(500).json({ error: err }))
});



module.exports = router