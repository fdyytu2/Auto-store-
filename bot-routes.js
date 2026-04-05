const express = require('express');
const router = express.Router();
const { Client, GatewayIntentBits } = require('discord.js');
const { BotConfig } = require('./db');

let client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Ambil info bot & token yang tersimpan
router.get('/info', async (req, res) => {
  try {
    const config = await BotConfig.findByPk(1);
    const botInfo = client.user ? {
      name: client.user.username,
      avatar: client.user.displayAvatarURL(),
      status: "Online"
    } : null;
    res.json({ token: config?.token || null, info: botInfo });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PASANG TOKEN (Bot Online)
router.post('/add', express.json(), async (req, res) => {
  const { token } = req.body;
  try {
    await client.login(token);
    await BotConfig.upsert({ id: 1, token });
    res.json({ info: { name: client.user.username, avatar: client.user.displayAvatarURL(), status: "Online" } });
  } catch (err) { res.status(400).json({ error: "Token Invalid!" }); }
});

// STOP BOT (Cuma Offline, Token Aman di DB)
router.post('/stop', async (req, res) => {
  try {
    if (client.user) client.destroy(); 
    client = new Client({ intents: [GatewayIntentBits.Guilds] });
    res.json({ message: "🛑 Bot Berhasil Offline!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE TOKEN (Baru deh hapus dari database)
router.post('/delete', async (req, res) => {
  try {
    if (client.user) client.destroy();
    client = new Client({ intents: [GatewayIntentBits.Guilds] });
    await BotConfig.destroy({ where: { id: 1 } });
    res.json({ message: "🗑️ Token Dihapus Permanen!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = { router, client };
