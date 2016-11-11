"use strict";

const { camelizeKeys, decamelizeKeys } = require('humps');
const bcrypt = require("bcrypt-as-promised");
const boom = require('boom');

const express = require("express");
const router = express.Router();
const knex = require("../knex");


router.get("/token", function (req, res, next) {
    if (req.cookies ["/token"] === "Chuck.E.Cheese") {
      res.json(true);
    }
    else {
      res.json(false);
    }
  });


router.post("/token", function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return next(boom.create(400, 'Email must not be blank'));
  }

  if (!password || password.length < 8) {
    return next(boom.create(400, 'Password must not be blank'));
  }

  let user;

  knex('users')
    .where('email', email)
    .first()
    .then((result) => {
      if (!result) {
        throw boom.create(400, 'Bad email or password');
      }

      user = camelizeKeys(result);

      return bcrypt.compare(password, user.hashedPassword);
    })
    .then(() => {
      delete user.hashedPassword;
      delete user.createdAt;
      delete user.updatedAt;

      var opts = {
        path: "/",
        httpOnly: true
      };

      res.cookie('/token', 'Chuck.E.Cheese', opts);

      if (user){
                res.status(200);
                res.json(user);
        } else {
                throw new Error();
        }
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw boom.create(400, 'Bad email or password');
    })
    .catch((err) => {
      res.set('Content-Type', 'text/plain');
              res.status(400);
              res.send('Bad email or password');
            });
});


router.delete("/token", function (req, res, next) {
  var opts = {
    path: "/",
    httpOnly: true
  };

  res.clearCookie('/token', opts);
  res.status(200);
  res.json(true);
});


module.exports = router;
