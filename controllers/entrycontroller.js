const express = require('express');
const router = express.Router();
const {Entry, Trip} = require('../models');
const validateSession = require('../middleware/validate-session');

// ---> CREATE NEW ENTRY (under tripcontroller file)
// ---> FIND ALL ENTRIES FOR A SINGLE TRIP (under tripcontoller file)

//! NOT CURRENTLY IMPLEMENTED:
// GET ALL ENTRIES FOR ALL TRIPS/USERS
// router.get("/", validateSession, (req, res) => {
//     Entry.findAll()
//       .then((entry) => res.status(200).json(entry))
//       .catch(err => res.status(500).json({ error: err }))
// });


//! NOT CURRENTLY IMPLEMENTED:
// GET ENTRY BY ID
// router.get("/:id", validateSession, (req, res) => {
//     Entry.findOne({ where: { id: req.params.id } })
//       .then((entry) => res.status(200).json(entry))
//       .catch((err) => res.status(500).json({ error: err }));
// });

// ---> UPDATE AN ENTRY
router.put('/update/:entryId', validateSession, async function (req, res) {
  console.log(req.body)
  const updateEntry = {
      entryDate: req.body.entryDate,
      entryName: req.body.entryName,
      entryDescription: req.body.entryDescription
  };

  const existingEntry = await Entry.findOne({ where: {id: req.params.entryId}});
  Trip.findOne({ where: {id: existingEntry.tripId, userId: req.user.id}})
    .then((trip) => {
  
      if (!trip) {
        res.status(403).json({message: "Forbidden"})

      } else {
        const query = { where: { id: req.params.entryId }};

        Entry.update(updateEntry, query)
            .then(() => res.status(200).json({message: 'Entry has been updated!'}))
            .catch((error) => res.status(500).json({ error: error.message || serverErrorMsg  }));
      }
    })
});

        
      


// ---> DELETE AN ENTRY:
router.delete('/:entryId', validateSession, async function (req, res) {
  console.log(req.body)

  const existingEntry = await Entry.findOne({ where: {id: req.params.entryId}});
  Trip.findOne({ where: {id: existingEntry.tripId, userId: req.user.id}})
    .then((trip) => {
  
      if (!trip) {
        res.status(403).json({message: "Forbidden"})

      } else {

        Entry.destroy({
          where: { id: req.params.entryId}
        })
            .then(() => res.status(200).json({message: 'Entry has been deleted.'}))
            .catch((error) => res.status(500).json({ error: error.message || serverErrorMsg  }));
      }
    })
});


module.exports = router