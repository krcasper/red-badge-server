const express = require('express');
const router = express.Router();
const {Trip, Entry} = require('../models');
const validateSession = require('../middleware/validate-session');

// --> FETCH ALL TRIPS [ADMIN ONLY]
router.get('/', validateSession, (req, res) => {
  if (req.user.checkAdmin === false) {
    res.status(404).json({ message: "Admin-Only"})
} else {
  Trip.findAll()
    .then(trips => res.status(200).json(trips))
    .catch(err => res.status(500).json({ error: err }))
}
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


//! NOT CURRENTLY IMPLEMENTED:
// FETCH A SINGLE TRIP BY ID NUMBER
// router.get("/:id", validateSession, (req, res) => {
  
//   Trip.findOne({ where: { id: req.params.id } })
//     .then((trip) => res.status(200).json(trip))
//     .catch((err) => res.status(500).json({ error: err }));
// });




// --> POST/CREATE A NEW TRIP:
router.post('/create', validateSession, async (req, res) => {
  console.log(req.body)
    try {
        const {tripName, tripDescription, tripDates} = req.body;

        let newTrip = await Trip.create({
            tripName, tripDescription, tripDates, userId: req.user.id
        });

        res.status(200).json({
            trip: newTrip,
            message: 'Trip Created!'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Trip Creation Failed here'
        })
    }
})

// --> UPDATE A TRIP (PUT):
router.put('/update/:id', validateSession, function (req, res) {
  console.log(req.body)
  const updateTrip = {
      tripName: req.body.tripName,
      tripDescription: req.body.tripDescription,
      tripDates: req.body.tripDates
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
  Trip.findOne({ where: {id: req.params.id}})
    .then((trip) => {
      if (trip.userId !== req.user.id) {
        res.status(403).json({message: "Forbidden"})

      } else {

        Trip.destroy({
          where: { id: req.params.id}
        })

        .then(() => res.status(200).json({ message: "Trip has been deleted."})
        .catch(err => res.json(err)))
      }
    })
})



// --> CREATING ENTRY FOR A TRIP (from entry.js model)

router.post('/:tripId/new-entry', validateSession, async (req, res) => {
  console.log(req.params)
  try {
      const trip = await Trip.findOne({ where: {id: req.params.tripId}});
      if (trip.userId !== req.user.id) {
        res.status(403).json({message: "Forbidden"})
        return;
      }

      const {entryDate, entryName, entryDescription} = req.body;

      let newEntry = await Entry.create({
          entryDate, entryName, entryDescription, tripId: req.params.tripId
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
router.get("/:tripId/entries", validateSession, async (req, res) => {
  const trip = await Trip.findOne({ where: { id: req.params.tripId }});
  if (trip.userId !== req.user.id) {
    res.status(401).json({ message: 'Forbidden' });
    return;
  }
  
  Entry.findAll({ where: { tripId: req.params.tripId } })
    .then((trip) => res.status(200).json(trip))
    .catch(err => res.json(err))


  });

module.exports = router
