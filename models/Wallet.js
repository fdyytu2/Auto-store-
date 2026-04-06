const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Wallet = sequelize.define('Wallet', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ownerId: { type: DataTypes.STRING, allowNull: false },
  discordId: { type: DataTypes.STRING, allowNull: false },
  targetId: { type: DataTypes.STRING, allowNull: true }, // Universal: ID Game, Email, dll
  saldo: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'wallets',
  timestamps: true,
  indexes: [{ unique: true, fields: ['ownerId', 'discordId'] }]
});

module.exports = Wallet;
