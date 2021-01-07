const express = require('express');
const router = express.Router();
const {User} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
router.post('/register', async (req, res) => {
//object deconstructing to separate data when sent in the body;
let { username, email, password, checkAdmin } = req.body; 

try {
    const newUser = await User.create({
    username,
    email, 
    password: bcrypt.hashSync(password, 13),
    checkAdmin
    })
    res.status(201).json({
    message: "User registered!",
    user: newUser
    })
} catch (error) {
    if (error instanceof UniqueConstraintError) {
    res.status(409).json({
        message: "Email already in use."
    })
    } else {
    res.status(500).json({
        error: "Failed to register user."
    })
    }
}
});
  

// --> USER LOGIN:
router.post('/login', function(req, res) {
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