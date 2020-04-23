const router = require("express").Router();
const restricted = require("../auth/restricted-middleware.js");
const db = require("../data/db-config");

router.get("/", restricted, (req, res) => {
  db("users")
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.log(restricted);
      res.send(err);
    });
});

module.exports = router;
