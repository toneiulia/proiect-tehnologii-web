const verificaAutentificare = async (req, res, next) => {
  if (!global.user) {
    res.status(403).send({ message: 'Utilizatorul nu este autentificat!' });
  } else {
    req.idUser = global.user.getDataValue('id');
    next();
  }
};

module.exports = verificaAutentificare;
