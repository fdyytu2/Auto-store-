const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Rahasia Railway Proxy: Gak butuh konfigurasi SSL!
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    keepAlive: true // Cuma butuh ini biar koneksi awet
  }
});

const BotConfig = sequelize.define('BotConfig', {
  id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
  token: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false });

// Kita cek salam sapa dulu (authenticate) sebelum bikin tabel
sequelize.authenticate()
  .then(() => {
    console.log("📦 [DB] Terhubung ke Postgres Railway!");
    return sequelize.sync();
  })
  .catch(err => console.error("⚠️ [DB ERROR] Gagal konek ke Railway:", err.message));

module.exports = { BotConfig };
