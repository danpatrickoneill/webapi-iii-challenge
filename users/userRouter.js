const express = require("express");

const router = express.Router();

const db = require("./userDb");

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  console.log("Checking ID...");
  db.getById(id)
    .then(user => {
      console.log("Valid ID detected.");
      req.user = user;
    })
    .catch(err => {
      console.log("ID is not valid!");
      res.status(400).json({ message: "invalid user id" });
    });

  next();
}

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

// Routes

router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

router.get("/", (req, res) => {
  db.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  db.getById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving user data" });
    });
});

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

module.exports = router;
