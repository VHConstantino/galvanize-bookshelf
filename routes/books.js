"use strict";

const express = require("express");
const router = express.Router();
const knex = require("../knex");

router.get("/books", function (req, res, next) {
  knex("books")
  .orderBy("title")
  .then(function (books) {
    res.json(books);
  })
  .catch(function (err) {
      next(new Error(err));
  });
});

router.get("/books/:id", function (req, res, next) {
  let id = Number(req.params.id);
  knex("books")
  .where("id", "=", id)
  .first()
  .then(function (books) {
    res.json(books);
  })
  .catch(function (err) {
      next(new Error(err));
  });
});

router.post("/books", function (req, res, next) {
  knex("books")
  .insert({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.cover_url
  })
  .returning(["title", "author", "genre", "description", "cover_url"])
  .then(function (books) {
    res.json(books[0]);
  })
  .catch(function (err) {
      next(new Error(err));
    });
});

router.patch("/books/:id", function (req, res, next) {
  let id = Number(req.params.id);
  knex("books").where("id", "=", id)
  .update({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.cover_url
  })
  .returning("*")
  .then(function (books) {
    res.json(books[0]);
  })
  .catch(function (err) {
      next(new Error(err));
    });
});

router.delete("/books/:id", function (req, res, next) {
  let id = Number(req.params.id);
  knex("books").where("id", "=", id)
  .del()
  .returning(["title", "author", "genre", "description", "cover_url"])
  .then(function (books) {
    res.json(books[0]);
  })
  .catch(function (err) {
      next(new Error(err));
    });
});

module.exports = router;
