const express = require('express');
const router = express.Router();
const {Entry} = require('../models');
const validateSession = require('../middleware/validate-session');

// ---> CREATE NEW ENTRY (under tripcontroller file)
// ---> FIND ALL ENTRIES FOR A SINGLE TRIP (under tripcontoller file)

// ---> GET ALL ENTRIES
router.get("/", validateSession, (req, res) => {
    Entry.findAll()
      .then((entry) => res.status(200).json(entry))
      .catch(err => res.status(500).json({ error: err }))
});

// ---> GET ENTRY BY ID
router.get("/:id", validateSession, (req, res) => {
    Entry.findOne({ where: { id: req.params.id } })
      .then((entry) => res.status(200).json(entry))
      .catch((err) => res.status(500).json({ error: err }));
});

// ---> UPDATE AN ENTRY
//! *********** FIX SO THAT USERS CAN ONLY UPDATE THEIR ENTRIES AND NOT OTHER USERS' ENTRIES *************
router.put('/update/:id', validateSession, function (req, res) {
    console.log(req.body)
    const updateEntry = {
      entryDate: req.body.entryDate,
        entryName: req.body.entryName,
        entryDescription: req.body.entryDescription
    };
  
    Entry.findOne({ where: {id: req.params.id}})
      .then((entry) => {
          const query = { where: { id: req.params.id }};
  
          Entry.update(updateEntry, query)
              .then(() => res.status(200).json({message: 'Entry has been updated!'}))
              .catch((error) => res.status(500).json({ error: error.message || serverErrorMsg  }));
        
      })
});

// ---> DELETE AN ENTRY:
router.delete('/:id', validateSession, (req, res) => {
    Entry.destroy({
      where: { id: req.params.id}
    })
    .then(entry => res.status(200).json(entry))
    .catch(err => res.json(err))
})

module.exports = router