const express = require('express');
const router = express.Router();
const {Trip, Entry} = require('../models');
const validateSession = require('../middleware/validate-session');

// --> FETCH ALL TRIPS 
router.get('/', validateSession, (req, res) => {
    Trip.findAll()
    .then(trips => res.status(200).json(trips))
    .catch(err => res.status(500).json({ error: err }))
});

// --> FETCH ALL TRIPS FOR A SINGLE USER (must have token!)
router.get("/my-trips", validateSession, (req, res) => {
  let userid = req.user.id
  Trip.findAll({
      where: { userId: userid }
  })
  .then(trips => res.status(200).json(trips))
  .catch(err => res.status(500).json({ error: err }))
});

// ---> FETCH A SINGLE TRIP BY ID NUMBER
//! NEEDS TO BE RESTRICTED TO A SINGLE USER??? OR ADMIN?
router.get("/:id", validateSession, (req, res) => {
  Trip.findOne({ where: { id: req.params.id } })
    .then((trip) => res.status(200).json(trip))
    .catch((err) => res.status(500).json({ error: err }));
});

// --> POST/CREATE A NEW TRIP:
router.post('/create', validateSession, async (req, res) => {
    try {
        const {tripName, tripDescription, tripMembers} = req.body;

        let newTrip = await Trip.create({
            tripName, tripDescription, tripMembers, userId: req.user.id
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
router.put('/update/:id', validateSession, function (req, res) {
  console.log(req.body)
  const updateTrip = {
      tripName: req.body.tripName,
      tripDescription: req.body.tripDescription,
      tripMembers: req.body.tripMembers
  };

  Trip.findOne({ where: {id: req.params.id}})
    .then((trip) => {
      if (trip.userId !== req.user.id) {
        res.status(403).json({message: "Forbidden"})

      } else {
        const query = { where: { id: req.params.id, userId: req.user.id }};

        Trip.update(updateTrip, query)
            .then(() => res.status(200).json({message: 'Trip has been updated!'}))
            .catch((error) => res.status(500).json({ error: error.message || serverErrorMsg  }));
      }
    })
});

// --> DELETE A TRIP:
router.delete('/:id', validateSession, (req, res) => {
    Trip.destroy({
      where: { id: req.params.id}
    })
    .then(trip => res.status(200).json(trip))
    .catch(err => res.json(err))
})



// --> CREATING ENTRY FOR A TRIP (from entry.js model)

router.post('/:tripId/new-entry', validateSession, async (req, res) => {
  console.log(req.params)
  try {
      const {entryName, entryDate, entryDescription} = req.body;

      let newEntry = await Entry.create({
          entryName, entryDate, entryDescription, tripId: req.params.tripId
      });

      res.status(200).json({
          entry: newEntry,
          message: 'Entry created!'
      })
  } catch (error) {
      console.log(error);
      res.status(500).json({
          message: 'Entry Creation Failed'
      })
  }
});

// --> GET ALL ENTRIES FOR A SINGLE TRIP
router.get("/:tripId/entries", validateSession, (req, res) => {
  Entry.findAll({ where: { tripId: req.params.tripId } })
    .then((trip) => res.status(200).json(trip))
    .catch(err => res.json(err))


  });

module.exports = router
