const bcrypt = require("bcryptjs");
const router = require("express").Router();
const db = require("../data/db-config");

router.post("/register", (req, res) => {
  const user = req.body;
  const round = process.env.ROUNDS;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  async function add(user) {
    const [id] = await db("users").insert(user, "id");

    return db("users")
      .where({ id })
      .first();
  }

  add(user)
    .then(saved => {
      res.status(201).json({ saved });
    })
    .catch(err => {
      console.log(user);
      res.status(500).json({ message: "problem registering user", error: err });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db("users")
    .where({ username })
    .then(([user]) => {
      //their response/where the password is stored user
      if (user && bcrypt.compareSync(password, user.password)) {
        //what is this?
        req.session.user = username;
        res.status(200).json({ message: "Logged in" });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "problem with the db, You also shall not pass!",
        error: err
      });
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.send("unable to logout");
    } else {
      res.send("logged out");
    }
  });
});
module.exports = router;
