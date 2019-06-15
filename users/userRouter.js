const express = require("express");

const router = express.Router();

const userDb = require("./userDb");
const postDb = require("../posts/postDb");

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  console.log("Checking ID...");
  userDb
    .getById(id)
    .then(user => {
      if (user.name) {
        console.log("Valid ID detected.");
        req.user = user;
      } else {
        console.log("ID is not valid!");
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch(err => {
      console.log("ID is not valid!");
      res.status(400).json({ message: "invalid user id" });
    });

  next();
}

function validateUser(req, res, next) {
  const newUser = req.body;
  console.log("Checking user data...");
  console.log(newUser);
  if (Object.entries(newUser).length === 0 && newUser.constructor === Object) {
    res.status(400).json({ message: "missing user data" });
  } else if (!newUser.name) {
    res.status(400).json({ message: "missing required name field" });
  }

  next();
}

function validatePost(req, res, next) {
  const newPost = req.body;
  console.log("Checking post data...");
  if (Object.entries(newPost).length === 0 && newPost.constructor === Object) {
    res.status(400).json({ message: "missing post data" });
  } else if (!newPost.text) {
    res.status(400).json({ message: "missing required text field" });
  }

  next();
}

// Routes

router.post("/", validateUser, (req, res) => {
  userDb
    .insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      res.status(500).json({ message: "Error creating new user." });
    });
});

router.post("/:id/posts", [validateUserId, validatePost], (req, res) => {
  const { id } = req.params;
  const newPost = req.body;
  newPost.user_id = id;
  console.log(newPost);
  postDb
    .insert(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({ message: "Error creating new post." });
    });
});

router.get("/", (req, res) => {
  userDb
    .get()
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
  userDb
    .getById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving user data" });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const { id } = req.params;
  console.log(id);
  const numID = Number(id);
  postDb
    .get()
    .then(posts => {
      const userPosts = posts.filter(post => post.user_id === numID);
      res.status(200).json({ userPosts });
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving post data" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  userDb
    .remove(id)
    .then(count => {
      res.status(200).json({ message: `${count} record(s) deleted.` });
    })
    .catch(err => {
      res.status(500).json({ message: "Error deleting user record." });
    });
});

router.put("/:id", [validateUserId, validateUser], (req, res) => {
  const { id } = req.params;
  console.log(id, req.body);
  userDb
    .update(id, req.body)
    .then(user => {
      res.status(200).json({ user });
    })
    .catch(err => {
      res.status(500).json({ message: "Error updating user record." });
    });
});

module.exports = router;
