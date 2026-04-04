const { Sequelize } = require('sequelize');
const sequelize = require('../db');
require('dotenv').config();

// Import semua model
const User = require('./User');
const Product = require('./Product');
const Transaction = require('./Transaction');
const Deposit = require('./Deposit');
const CustomBot, Deposit, Transaction = require('./CustomBot, Deposit, Transaction');
const Deposit = require('./Deposit');
const Transaction = require('./Transaction');
const Guild = require('./Guild');
const Setting = require('./Setting');
const Subscription = require('./Subscription');

const db = { sequelize, Sequelize, User, Product, Transaction, Deposit, CustomBot, Deposit, Transaction, Guild, Setting, Subscription };

// ==========================================
// FUNGSI WEBHOOK DENGAN TANGGAL & JAM (WIB)
// ==========================================
const sendWebhook = async (message, isError = false) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK;
    if (!webhookUrl) return;

    // Ambil waktu sekarang di Indonesia (WIB)
    const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const prefix = isError ? '🚨 **[ERROR DASHBOARD]**' : '✅ **[SUCCESS DASHBOARD]**';
    
    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `${prefix} - 🗓️ \`${time}\`\n${message}`
            })
        });
    } catch (e) {
        console.error('Gagal kirim webhook Discord:', e);
    }
};

// ==========================================
// SINKRONISASI DATABASE & LAPORAN
// ==========================================
db.sequelize.sync({ alter: true })
  .then(() => {
      const msg = '```js\nSemua tabel database berhasil disinkronkan ke PostgreSQL!\n```';
      console.log('✅ Berhasil sinkronisasi database');
      sendWebhook(msg, false); // Kirim laporan sukses ke Discord!
  })
  .catch(err => {
      const msg = `Gagal sinkronisasi database:\n\`\`\`js\n${err.stack || err.message}\n\`\`\``;
      console.error(msg);
      sendWebhook(msg, true); // Kirim laporan error ke Discord
  });

module.exports = db;
