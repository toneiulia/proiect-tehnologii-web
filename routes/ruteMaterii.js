const express = require('express');
const Materie = require('../sequelize/Materie');
const app = express();


app.get('/', async (req, res, next) => {
    try {
      const materii = await Materie.findAll();
      res.status(200).json(materii);
    } catch (err) {
      next(err);
    }
});

app.post('/', async (req, res, next) => {
  try {
    if ( req.body.nume){
        await Materie.create(req.body);
        res.status(201).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    next(err);
  }
});
module.exports = app;