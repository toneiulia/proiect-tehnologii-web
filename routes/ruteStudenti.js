const express = require('express');
const Student = require('../sequelize/Student');
const autentificare = require('./autentificare');
const app = express();

app.get('/isloggedin', autentificare, async (req, res) => {
  return res.status(200).json({ ok: true });
});
app.get('/logout', autentificare, async (req, res) => {
  global.user = null;
  return res.status(200);
});
app.get('/:email', autentificare, async (req, res, next) => {
  try {
    const student = await Student.findOne({
      raw: true,
      where: { email: req.params.email },
    });
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
});
// get students
app.get('/', autentificare, async (req, res, next) => {
  try {
    const students = await Student.findAll({
      raw: true,
    });
    let studentiNoi = [];
    for (let student of students) {
      if (student.id !== req.idUser) studentiNoi.push(student);
    }
    res.status(200).json(studentiNoi);
  } catch (err) {
    next(err);
  }
});
// post student
app.post('/', async (req, res, next) => {
  try {
    if (req.body.name && req.body.password && req.body.email) {
      await Student.create(req.body);
      res.status(201).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    next(err);
  }
});

app.get('/logout', async (req, res) => {
  if (global.user) {
    global.user = null;
    res.status(200).send();
  } else res.status(404).send();
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({
    where: { email, password },
  });
  if (!student) {
    res.status(403).send();
  } else {
    global.user = student;
    res.status(200).send();
  }
});

app.put('/:studentId', async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.studentId);
    if (student) {
      if (req.body.name && req.body.password && req.body.email) {
        await student.update(req.body);
        res.status(201).send();
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

app.delete('/:studentId', async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.studentId);
    if (student) {
      await student.destroy();
      res.status(202).send();
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
});

module.exports = app;
