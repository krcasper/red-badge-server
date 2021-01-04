const express = require('express');
const router = express.Router();
const {User} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateSession = require('../middleware/validate-session');

const { check, validationResult } = require('express-validator');



// --> GET ALL USERS (ADMIN)
router.get('/', validateSession, (req, res) => {
    User.findAll() 
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({
        error: err
    }))
})

// --> GET ONE USER

// --> CREATE NEW USER
router.post('/register', 
check('email').isEmail().withMessage('Please enter a valid email address.'),
check('password').isLength({ min: 5 }).withMessage('Password must contain 5 or more characters'),

(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 13),
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
})


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

module.exports = router;



//! BEGIN CODE THAT NEEDS TO BE DELETED
//     let newUser = await User.create({
//         firstName, lastName, email, username, password, checkAdmin
//     });

//     res.status(200).json({
//         user: newUser,
//         message: 'User Created!'
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: 'User Creation Failed.'
//         })
//     }
// })

// router.post('/create', async (req, res) => {

//     User.create({
//         firstName: req.body.user.firstName,
//         lastName: req.body.user.lastName,
//         email: req.body.user.email,
//         password: bcrypt.hashSync(req.body.user.password, 13)
//     })
//         .then(
//             function createSuccess(user) {
//                 let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
//                 res.json({
//                     user: user,
//                     message: 'User successfully created!',
//                     sessionToken: token
//                 });
//             }  
//         )
//         .catch(err => res.status(500).json({ error: err }))
// });
//! END CODE THAT NEEDS TO BE DELETED






