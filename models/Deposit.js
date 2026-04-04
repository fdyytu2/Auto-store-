const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Deposit = sequelize.define('Deposit', {
  userId: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, success, failed
  paymentMethod: { type: DataTypes.STRING, allowNull: true },
  refId: { type: DataTypes.STRING, allowNull: true } // ID dari Payment Gateway
}, {
  tableName: 'deposits',
  timestamps: true
});

module.exports = Deposit;
