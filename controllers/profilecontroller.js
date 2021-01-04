const express = require('express');
const router = express.Router();
const {Profile} = require('../models');
const validateSession = require('../middleware/validate-session');

// --> GET ALL PROFILES (ADMIN)
router.get('/', validateSession, (req, res) => {
  Profile.findAll()
  .then(profiles => res.status(200).json(profiles))
  .catch(err => res.status(500).json({ error: err }))
});

// --> GET A SPECIFIC USER PROFILE PAGE
router.get("/:id", (req, res) => {
    Profile.findOne({ where: { user: req.params.user } })
      .then((profile) => res.status(200).json(profile))
      .catch((err) => res.status(500).json({ error: err }));
});


// --> CREATE A NEW PROFILE PAGE
router.post('/create', validateSession, async (req, res) => {
    try {
        const {aboutMe, placesVisited, travelGoals} = req.body;

        let newProfile = await Profile.create({
            aboutMe, placesVisited, travelGoals, user: req.user.id
        });

        res.status(200).json({
            profile: newProfile,
            message: 'User Profile Created!'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Profile Creation Failed'
        })
    }
});

// --> UPDATE AN EXISTING PROFILE PAGE
router.put("/:id", (req, res) => {
      const query = req.params.id;
      Profile.update(req.body, { where: { id: query } })
        .then((profilesUpdated) => {
          Profile.findOne({ where: { id: query } })
          .then((locatedUpdatedProfile) => {
            res.status(200).json({
              profile: locatedUpdatedProfile,
              message: "Profile updated successful",
              profilesUpdated: profilesUpdated,
            });
          });
        })
        .catch((err) => res.json({
          err
        }));
});

// --> DELETE A USER PROFILE PAGE
router.delete('/:id', (req, res) => {
  Profile.destroy({
    where: { id: req.params.id}
  })
  .then(profile => res.status(200).json(profile))
  .catch(err => res.json(err))
})


module.exports = router