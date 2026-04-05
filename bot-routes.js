const express = require('express');
const router = express.Router();
const { Client, GatewayIntentBits } = require('discord.js');
const { BotConfig } = require('./db');

let client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Fungsi Login biar bisa dipanggil dari server.js
const startBot = async (token) => {
  try {
    await client.login(token);
    return true;
  } catch (err) {
    return false;
  }
};

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

router.post('/add', express.json(), async (req, res) => {
  const { token } = req.body;
  const success = await startBot(token);
  if (success) {
    await BotConfig.upsert({ id: 1, token });
    res.json({ info: { name: client.user.username, avatar: client.user.displayAvatarURL(), status: "Online" } });
  } else {
    res.status(400).json({ error: "Token Invalid!" });
  }
});

router.post('/delete', async (req, res) => {
  try {
    if (client.user) client.destroy();
    client = new Client({ intents: [GatewayIntentBits.Guilds] });
    await BotConfig.destroy({ where: { id: 1 } });
    res.json({ message: "🗑️ Token Dihapus!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = { router, client, startBot };
