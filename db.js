const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  }
});

const BotConfig = sequelize.define('BotConfig', {
  id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
  token: { type: DataTypes.STRING, allowNull: false }
}, { 
  tableName: 'BotConfigs',
  timestamps: false 
});

// Paksa hapus tabel lama yang error dan bikin baru yang bener
sequelize.sync({ force: true })
  .then(() => console.log("📦 [DB] DATA LAMA DIHAPUS & TABEL DIBERSIHKAN!"))
  .catch(err => console.error("⚠️ [DB ERROR]:", err.message));

module.exports = { BotConfig, sequelize };
