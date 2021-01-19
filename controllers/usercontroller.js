const express = require('express');
const router = express.Router();
const {User} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateSession = require('../middleware/validate-session');

const { UniqueConstraintError } = require('sequelize/lib/errors');

// --> GET ALL USERS [ADMIN ONLY]
router.get('/', validateSession, (req, res) => {
    if (req.user.checkAdmin === false) {
        res.status(404).json({ message: "Admin-Only"})
    } else {
    User.findAll() 
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({
        error: err
    }))
}
});

// --> GET USER BY USER ID [ADMIN ONLY]
router.get("/:id", validateSession, (req, res) => {

    if (req.user.checkAdmin === false) {
        res.status(404).json({ message: "Admin-Only: Delete"})
    } else {
    User.findOne({
      where: { id: req.params.id}
    })
    .then((user) => res.status(200).json(user))
    .catch(err => res.status(500).json({
        error: err
    }))
}
});



// --> CREATE NEW USER
router.post('/register', function(req, res) {

    User.create({
        email: req.body.email,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 13),
        checkAdmin: req.body.checkAdmin
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

// ----> EDIT USER [ADMIN ONLY]
router.put('/:id', validateSession, function (req, res) {
    const updateUser = {
        email: req.body.email,
        username: req.body.username,
        checkAdmin: req.body.checkAdmin
    };
  
    User.findOne({ where: {id: req.params.id}})
      .then((user) => {
        if (req.user.checkAdmin === false) {
            res.status(404).json({ message: "Admin-Only"})
        } else {
          const query = { where: { id: req.params.id }};
  
          User.update(updateUser, query)
              .then(() => res.status(200).json({message: 'User has been updated!'}))
              .catch((error) => res.status(500).json({ error: error.message || serverErrorMsg  }));
        }
      })
  });



// -----> DELETE USER [ADMIN ONLY]
router.delete('/:id', validateSession, (req, res) => {
    if (req.user.checkAdmin === false) {
        res.status(404).json({ message: "Admin-Only: Delete"})
    } else {
    User.destroy({
      where: { id: req.params.id}
    })
    .then(() => res.status(200).json({message: 'User has been deleted!'}))
    .catch(err => res.json(err))
}
});

module.exports = router