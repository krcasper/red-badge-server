const express = require('express');
const router = express.Router();
const {Trip} = require('../models');
const validateSession = require('../middleware/validate-session');

// --> FETCH/GET ALL TRIPS FROM ALL USERS (ADMIN)
router.get('/', validateSession, (req, res) => {
    Trip.findAll()
    .then(trips => res.status(200).json(trips))
    .catch(err => res.status(500).json({ error: err }))
});

// ---> FETCH ALL TRIPS FOR A specific USER - NOW WORKING!
router.get("/:userID", validateSession, (req, res) => {
  Trip.findAll({ where: { owner: req.user.id } })
    .then((trip) => res.status(200).json(trip))
    .catch((err) => res.status(500).json({ error: err }));
});

// --> POST/CREATE A NEW TRIP:
router.post('/create', validateSession, async (req, res) => {
    try {
        const {tripName, tripDescription, tripMembers} = req.body;

        let newTrip = await Trip.create({
            tripName, tripDescription, tripMembers, owner: req.user.id
        });

        res.status(200).json({
            trip: newTrip,
            message: 'Trip Created!'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Trip Creation Failed'
        })
    }
})

router.put('/update/:id', validateSession, function (req, res) {
  console.log(req.body)
  const updateTrip = {
      tripName: req.body.tripName,
      tripDescription: req.body.tripDescription,
      tripMembers: req.body.tripMembers
  };

  Trip.findOne({ where: {id: req.params.id}})
    .then((trip) => {
      if (trip.owner !== req.user.id) {
        res.status(403).json({message: "Forbidden"})

      } else {
        const query = { where: { id: req.params.id, owner: req.user.id }};

        Trip.update(updateTrip, query)
            .then(() => res.status(200).json({message: 'Trip has been updated!'}))
            .catch((error) => res.status(500).json({ error: error.message || serverErrorMsg  }));
      }
    })
  
});

// router.get("/:id", (req, res) => {
//   Profile.findOne({ where: { user: req.params.user } })
//     .then((profile) => res.status(200).json(profile))
//     .catch((err) => res.status(500).json({ error: err }));
// });



// --> DELETE A TRIP:
router.delete('/:id', validateSession, (req, res) => {
    Trip.destroy({
      where: { id: req.params.id}
    })
    .then(trip => res.status(200).json(trip))
    .catch(err => res.json(err))
  })

module.exports = router;
