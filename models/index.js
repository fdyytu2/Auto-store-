const fs = require('fs');
const path = require('path');
const { sequelize } = require('../db');

const db = {};

// Baca semua file di dalam folder models/ secara otomatis
fs.readdirSync(__dirname)
  .filter(file => {
    // Jangan baca index.js dan file tersembunyi
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    // Masukin masing-masing model ke dalam object db
    db[model.name] = model;
  });

// Masukin koneksi database utama
db.sequelize = sequelize;

module.exports = db;
