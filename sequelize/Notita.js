const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');

const Notita = sequelize.define('notita', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titlu: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  resurse: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Notita;
