const express = require('express');
const Notita = require('../sequelize/Notita');
const Materie = require('../sequelize/Materie');
const Student = require('../sequelize/Student');
const verificaAutentificare = require('./autentificare');
const app = express();

app.get('/toate', async (req, res, next) => {
  try {
    const notitas = await Notita.findAll();
    res.status(200).json(notitas);
  } catch (err) {
    next(err);
  }
});

app.get('/', verificaAutentificare, async (req, res, next) => {
  try {
    const user = global.user;
    const notitas = await Notita.findAll({ where: { creatorId: req.idUser } });
    // const notitas = await user.getNotita();
    if (notitas && notitas.length > 0) {
      res.status(200).json(notitas);
    } else res.status(200).json([]);
  } catch (err) {
    next(err);
  }
});

app.post('/', verificaAutentificare, async (req, res, next) => {
  try {
    if (req.body.text && req.body.data && req.body.materieId) {
      const student = global.user;
      const materie = await Materie.findByPk(req.body.materieId);
      if (materie) {
        let param = {
          text: req.body.text,
          data: new Date(),
          materieId: req.body.materieId,
          creatorId: req.idUser,
          resurse: req.body.resurse,
          titlu: req.body.titlu,
        };
        const notita = await Notita.create(param);
        student.addNotita(notita);
        await student.save();
        res.status(201).send();
      } else res.status(404).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    next(err);
  }
});

app.put('/:notitaId', verificaAutentificare, async (req, res, next) => {
  try {
    if (req.body.text && req.body.data) {
      const student = global.user;
      const notite = await Notita.findAll({
        where: {
          creatorId: req.idUser,
          id: req.params.notitaId,
        },
      });
      const deActualizat = notite.shift();
      if (deActualizat) {
        await deActualizat.update(req.body);
        res.status(201).send();
      } else res.status(404).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    next(err);
  }
});

app.get('/:notitaId', verificaAutentificare, async (req, res, next) => {
  try {
    const student = global.user;
    const notite = await Notita.findAll({
      where: {
        creatorId: student.id,
        id: req.params.notitaId,
      },
    });
    const notita = notite.shift();
    if (notita) {
      res.json(notita);
    } else res.status(404).send();
  } catch (err) {
    next(err);
  }
});

app.delete('/:notitaId', verificaAutentificare, async (req, res, next) => {
  try {
    const student = global.user;
    const notitas = await Notita.findAll({
      where: {
        creatorId: req.idUser,
        id: req.params.notitaId,
      },
    });
    const notita = notitas.shift();
    if (notita) {
      await notita.destroy();
      res.status(204).send();
    } else res.status(404).send();
  } catch (err) {
    next(err);
  }
});

// partajare notita de la un student la altul -> acces
app.post(
  '/:notitaId/studenti/:studentId',
  verificaAutentificare,
  async (req, res, next) => {
    try {
      const admin = global.user;
      const notita = await Notita.findByPk(req.params.notitaId);
      if (notita && notita.creatorId == admin.id) {
        const student = await Student.findByPk(req.params.userId);
        if (student) {
          student.addNotita(notita);
          await student.save();
          res.status(201).send();
        } else res.status(404).send();
      } else res.status(404).send();
    } catch (err) {
      next(err);
    }
  }
);
module.exports = app;
