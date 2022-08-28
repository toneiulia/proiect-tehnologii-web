const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./sequelize/sequelize');
const port = 8080;

const ruteStudenti = require('./routes/ruteStudenti');
const ruteMaterii = require('./routes/ruteMaterii');
const ruteNotite = require('./routes/ruteNotite');
const ruteGrupuriStudiu = require('./routes/ruteGrupuriStudiu');
const Student = require('./sequelize/Student');
const Materie = require('./sequelize/Materie');
const Notita = require('./sequelize/Notita');
const GrupStudiu = require('./sequelize/GrupStudiu');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// relatii:
Notita.belongsTo(Student, { as: 'creator' });
Notita.belongsToMany(Student, { through: 'studenti_notite' });
Student.belongsToMany(Notita, { through: 'studenti_notite' });

Materie.hasMany(Notita);
Notita.belongsTo(Materie, { as: 'materie' });

GrupStudiu.belongsTo(Student, { foreignKey: 'creator' });

GrupStudiu.belongsToMany(Student, { through: 'studenti_grupuri' });
Student.belongsToMany(GrupStudiu, { through: 'studenti_grupuri' });

GrupStudiu.belongsToMany(Notita, { through: 'grupuri_notite' });
Notita.belongsToMany(GrupStudiu, { through: 'grupuri_notite' });

app.use(cors());

app.get('/creare', async (req, res, next) => {
  try {
    await sequelize.sync({ force: true });
    res.status(201).json({ message: 'Baza de date creata cu succes!' });
  } catch (err) {
    next(err);
  }
});

app.use('/studenti', ruteStudenti);
app.use('/notite', ruteNotite);
app.use('/materii', ruteMaterii);
app.use('/grupuri', ruteGrupuriStudiu);

app.listen(port, async () => {
  try {
    await sequelize.sync();
    console.log('Server up on http://localhost:' + port);
  } catch (e) {
    console.log(e);
  }
});
