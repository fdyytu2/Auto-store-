const { Sequelize } = require('sequelize');
const sequelize = require('../db');

// Import semua model
const User = require('./User');
const Product = require('./Product');
const Transaction = require('./Transaction');
const Deposit = require('./Deposit');
const CustomBot = require('./CustomBot');
const Guild = require('./Guild');
const Setting = require('./Setting');
const Subscription = require('./Subscription');

// Masukin ke objek db
const db = {
  sequelize,
  Sequelize,
  User,
  Product,
  Transaction,
  Deposit,
  CustomBot,
  Guild,
  Setting,
  Subscription
};

// Sinkronisasi database
db.sequelize.sync({ alter: true })
  .then(() => console.log('✅ Semua tabel database berhasil disinkronkan!'))
  .catch(err => console.error('❌ Gagal sinkronisasi database:', err));

module.exports = db;
