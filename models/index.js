const sequelize = require('../db');

// Import semua model di sini
const User = require('./User');
const Product = require('./Product');
const Transaction = require('./Transaction');
// ... tambahin model lainnya kalau ada ...

const db = {
  sequelize,
  Sequelize,
  User,
  Product,
  Transaction
};

module.exports = db;
