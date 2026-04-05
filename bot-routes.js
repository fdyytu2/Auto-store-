const express = require('express');
const router = express.Router();
router.use(express.json());
const { startBot, stopBot, getBotInfo } = require('./discord-engine');
const { BotConfig } = require('./db');

// FITUR SAKTI: AUTO-START PAS TERMUX NYALA 🗿🔥
setTimeout(async () => {
  try {
    const config = await BotConfig.findByPk(1);
    if (config && config.token) {
      console.log("🤖 [AUTO-START] Menghidupkan bot dari database...");
      await startBot(config.token);
      console.log("✅ [AUTO-START] Bot Master Berhasil Mengudara!");
    }
  } catch (err) {
    console.log("⚠️ [AUTO-START] Gagal konek/Bot belum di-set.");
  }
}, 3000); // Tunggu 3 detik biar database konek dulu

router.get('/info', async (req, res) => {
  const info = getBotInfo();
  const config = await BotConfig.findByPk(1);
  res.json({ token: config ? config.token : null, info });
});

router.post('/add', async (req, res) => {
  const { token } = req.body;
  try {
    const info = await startBot(token);
    await BotConfig.upsert({ id: 1, token: token }); // Simpan ke Postgres
    console.log("💾 [DB] Token Master Berhasil Disemen di Railway!");
    res.json({ success: true, info });
  } catch (err) {
    res.status(400).json({ error: "Token Gak Valid!" });
  }
});

router.post('/delete', async (req, res) => {
  stopBot();
  await BotConfig.destroy({ where: { id: 1 } }); // Hapus dari Postgres
  console.log("🗑️ [DB] Token Dihapus dari Railway.");
  res.json({ success: true });
});

module.exports = router;
