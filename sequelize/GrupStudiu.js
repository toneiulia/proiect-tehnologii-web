const sequelize = require('./sequelize');
const { DataTypes } = require('sequelize');

const GrupStudiu = sequelize.define('grupstudiu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nume: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creator: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = GrupStudiu;
