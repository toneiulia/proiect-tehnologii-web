const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');

const Materie = sequelize.define('materie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nume: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Materie;
