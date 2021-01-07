// const jwt = require('jsonwebtoken');
// const {User} = require('../models');

// const validateSession = (req, res, next) => {
//     const token = req.headers.authorization; 
    

//     if(!token) {
//         return res.status(403).send({ auth: false, message: "No token provided" }) 
//     } else {
//         jwt.verify(token, process.env.JWT_SECRET, (err, decodeToken) => {
            
//             if (!err && decodeToken) { 
//                 User.findOne({ 
//                     where: {
//                         id: decodeToken.id
//                     }
//                 })

//                 .then(user => {
                   
//                     if (!user) throw err; 
                    
//                     req.user = user; 
//                     return next(); 
//                 })
//                 .catch(err => next(err));
//             } else {
//                 req.errors = err;
//                 return res.status(500).send('Not authorized.')
//             }
//         })
//     }
// };

// module.exports = validateSession;


const jwt = require('jsonwebtoken');
const {User} = require('../models');

const validateSession = (req, res, next) => {
    if (req.method === "OPTIONS") {
      return next();
    } else if (req.headers.authorization) {
      const { authorization } = req.headers;
  
      const payload = authorization
        ? jwt.verify(authorization, process.env.JWT_SECRET)
        : undefined;
      console.log(payload);
  
      if (payload) {
        User.findOne({
          where: { id: payload.id }, // finds a user whose id matches the id that was assigned upon login
        }).then((user) => {
          req.user = user; // creates a user object inside of req object. This object stores the data we grabbed from the user table in the database
  
          next(); // next jumps out of the callback function. We use this to stop triggering the callback function a second time.
        });
      } else {
        res.status(401).json({
          message: "Not authorized",
        });
      }
    } else {
      res.status(401).json({
        message: "Not allowed.",
      });
    }
  };
  
  module.exports = validateSession;
