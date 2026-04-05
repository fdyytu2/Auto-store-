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
}, { tableName: 'BotConfigs', timestamps: false });

// Pakai ALTER biar data gak ilang pas restart!
sequelize.sync({ alter: true })
  .then(() => console.log("📦 [DB] Database Sinkron & Aman!"))
  .catch(err => console.error("⚠️ [DB ERROR]:", err.message));

module.exports = { BotConfig, sequelize };
