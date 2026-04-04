const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Subscription = sequelize.define('Subscription', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  plan: {
    // Kasta yang bener: basic, advance, pro, ultra
    type: DataTypes.ENUM('basic', 'advance', 'pro', 'ultra'),
    defaultValue: 'basic'
  },
  expiredAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'subscriptions',
  timestamps: true
});

module.exports = Subscription;
