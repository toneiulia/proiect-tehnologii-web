const express = require('express');
const GrupStudiu = require('../sequelize/GrupStudiu');
const Notita = require('../sequelize/Notita');
const sequelize = require('../sequelize/sequelize');
const Student = require('../sequelize/Student');
const verificaAutentificare = require('./autentificare');
const app = express();

app.get('/', verificaAutentificare, async (req, res, next) => {
  try {
    const grups = await GrupStudiu.findAll();
    res.status(200).json(grups);
  } catch (err) {
    next(err);
  }
});
// intoarce grupurile create de un utilizator autentificat
app.get('/create', verificaAutentificare, async (req, res, next) => {
  try {
    const user = await Student.findByPk(req.idUser);
    if (user) {
      const grups = await user.getGrupstudius();
      res.status(200).json(grups);
    } else res.status(404).send();
  } catch (err) {
    next(err);
  }
});
// intoarce grupurile in care este un utilizator autentificat

app.get('/membru', verificaAutentificare, async (req, res, next) => {
  try {
    const user = await Student.findByPk(req.idUser);
    if (user) {
      const [grups, metadata] = await sequelize.query(
        `select grupstudiuId as id,nume,creator from studenti_grupuri,grupstudius where studentId = ${req.idUser} and grupstudiuId = grupstudius.id`
      );
      grups.forEach((grup) => (grup.canEdit = req.idUser === grup.creator));
      return res.status(200).json(grups);
    } else res.status(404).send();
  } catch (err) {
    next(err);
  }
});
// studenti de la un anumit grup dupa grup id
app.get('/:grupId/studenti', verificaAutentificare, async (req, res, next) => {
  try {
    const grup = await GrupStudiu.findByPk(req.params.grupId);
    if (grup) {
      const students = await grup.getStudents();
      res.status(200).json(students);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
});
//notite de la un anumit grup dupa id
app.get('/:grupId/notite', verificaAutentificare, async (req, res, next) => {
  try {
    const grup = await GrupStudiu.findByPk(req.params.grupId);
    if (grup) {
      const notite = await grup.getNotita();
      res.status(200).json(notite);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
});
// creare grup de catre un utilizator autentificat
app.post('/', verificaAutentificare, async (req, res, next) => {
  try {
    if (req.body.nume) {
      const student = global.user;
      let prop = {
        nume: req.body.nume,
        creator: req.idUser,
      };
      if (req.body.id) prop.id = req.body.id;
      const grup = await GrupStudiu.create(prop);
      student.addGrupstudius(grup);
      await student.save();
      res.status(201).send();
    } else res.status(400).send();
  } catch (err) {
    next(err);
  }
});

app.get('/:grupId', verificaAutentificare, async (req, res, next) => {
  try {
    const grup = await GrupStudiu.findByPk(req.params.grupId);
    if (grup) {
      const student = global.user;
      if (student) {
        res.status(200).json(grup);
      } else res.status(404).send();
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
});

app.put('/:grupId', verificaAutentificare, async (req, res, next) => {
  try {
    const grup = await GrupStudiu.findByPk(req.params.grupId);
    if (grup) {
      if (req.body.nume) {
        const student = global.user;
        if (student) {
          let prop = {
            nume: req.body.nume,
            creator: req.idUser,
          };
          await grup.update(prop);
          res.status(201).send();
        } else res.status(404).send();
      } else {
        res.status(400).send();
      }
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
});

app.delete('/:grupId', verificaAutentificare, async (req, res, next) => {
  try {
    const grup = await GrupStudiu.findByPk(req.params.grupId);
    if (grup) {
      const student = global.user;
      if (student) {
        await grup.destroy();
        res.status(201).send();
      } else res.status(404).send();
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
});

// adaugare studenti in grup
app.post('/student/:grupId', verificaAutentificare, async (req, res, next) => {
  try {
    const admin = global.user;
    if (admin) {
      const grups = await GrupStudiu.findAll({
        where: { creator: req.idUser },
      });
      let grup = grups.filter(
        (grup) => grup.getDataValue('id') == req.params.grupId
      );
      if (grup) grup = grup[0];
      if (grup && grup.id == req.params.grupId) {
        if (req.body.id) {
          if (req.body.id == req.idUser) res.status(403).send();
          else {
            const student = await Student.findByPk(req.body.id);
            if (student) {
              grup.addStudent(student);
              await grup.save();
              res.status(201).send();
            } else res.status(404).send();
          }
        } else res.status(400).send();
      } else res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
});
// adaugare notita in grup de catre admin
app.post('/notes/:nume', verificaAutentificare, async (req, res, next) => {
  try {
    const admin = global.user;
    if (admin) {
      const grups = await GrupStudiu.findAll();
      let grup = grups.filter(
        (grup) => grup.getDataValue('nume') == req.params.nume
      );
      if (grup) grup = grup[0];
      if (grup) {
        if (req.body.id) {
          const note = await Notita.findByPk(req.body.id);
          if (note) {
            grup.addNotita(note);
            await grup.save();
            res.status(200).send();
          } else res.status(404).send();
        } else res.status(400).send();
      } else res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
});
module.exports = app;
