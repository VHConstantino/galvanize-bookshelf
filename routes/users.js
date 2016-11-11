"use strict";

const express = require("express");

const router = express.Router();
const knex = require("../knex");
const bcrypt = require("bcrypt");

router.post("/users", function (req, res, next) {
  let password = bcrypt.hashSync(req.body.password, 3);
  knex("users")
  .insert({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    hashed_password: password
  })
  .returning(["id", "first_name", "last_name", "email"])
  .then(function (users) {
    res.json(users[0])
  })
  .catch(function (err) {
      next(new Error(err));
    });
});

module.exports = router;
