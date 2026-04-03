const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Subscription = sequelize.define('Subscription', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  plan: {
    type: DataTypes.ENUM('free', 'pro', 'ultra'),
    defaultValue: 'free'
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
