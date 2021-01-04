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

// ---> FETCH A SINGLE TRIP
//! NOT WORKING
router.get("/:tripID", (req, res) => {
  Trip.findOne({ where: { trip: req.params.tripID } })
    .then((profile) => res.status(200).json(profile))
    .catch((err) => res.status(500).json({ error: err }));
});

// --> POST/CREATE A NEW TRIP:
router.post('/create', validateSession, async (req, res) => {
    try {
        const {tripName, tripDescription, tripMembers} = req.body;

        let newTrip = await Trip.create({
            tripName, tripDescription, tripMembers, user: req.user.id
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

// --> UPDATE A TRIP (PUT):
router.put("/:id", (req, res) => {
      const query = req.params.id;
      Trip.update(req.body, { where: { id: query } })
        .then((tripsUpdated) => {
          Trip.findOne({ where: { id: query } })
          .then((locatedUpdatedTrip) => {
            res.status(200).json({
              trip: locatedUpdatedTrip,
              message: "Trip updated!",
              tripsChanged: tripsUpdated,
            });
          });
        })
        .catch((err) => res.json({
          err
        }));
});


// --> DELETE A TRIP:
router.delete('/:id', (req, res) => {
    Trip.destroy({
      where: { id: req.params.id}
    })
    .then(trip => res.status(200).json(trip))
    .catch(err => res.json(err))
  })

module.exports = router;

//! BEGIN CODE TO BE DELETED:
// router.post('/create', (req, res) => {
//     const tripCreate = {
//         tripName: req.body.tripName,
//         tripDescription: req.body.tripDescription,
//         tripMembers: req.body.tripMembers
//     }
//     Trip.create(tripCreate)
//         .then(trip => res.status(200).json({
//             trip,
//             message: "Trip successfully created!"
//         }))
//         .catch(err => res.status(500).json({ error: err }))
// });

// router.put('/:id', validateSession, (req, res) => {
//     const updateTrip = {
//         tripName: req.body.tripName,
//         tripDescription: req.body.tripDescription,
//         tripMembers: req.body.tripMembers,
//     };

//     const query = { where: { id: req.params.entryId, owner_id: req.user.id } };

//     Trip.update(updateTrip, query)
//     .then((trip) => res.status(200).json(trip))
//     .catch((err) => res.status(500).json({ error: err }));
// });
//! END CODE THAT NEEDS TO BE DELETED
