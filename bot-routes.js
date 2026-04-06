const express = require('express');
const router = express.Router();
const { Client, GatewayIntentBits } = require('discord.js');
const { BotConfig } = require('./db');

let client = new Client({ intents: [GatewayIntentBits.Guilds] });

const startBot = async (token) => {
  try {
    if (client.isReady()) await client.destroy();
    client = new Client({ intents: [GatewayIntentBits.Guilds] });
    
    return new Promise((resolve) => {
      client.once('ready', () => {
        console.log(`✅ Kora Ready: ${client.user.tag}`);
        resolve(true);
      });
      client.login(token).catch(() => resolve(false));
      setTimeout(() => resolve(false), 15000);
    });
  } catch (err) {
    return false;
  }
};

router.get('/info', async (req, res) => {
  try {
    const config = await BotConfig.findByPk(1);
    // Pake isReady() biar akurat 100%, gak ketipu sama cache Discord
    const isOnline = client && client.isReady();
    
    const botInfo = isOnline ? {
      name: client.user.username,
      avatar: client.user.displayAvatarURL(),
      status: "Online"
    } : (config && config.token ? {
      name: "Bot Offline",
      avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
      status: "Offline"
    } : null);

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

router.post('/stop', async (req, res) => {
  try {
    if (client.isReady()) await client.destroy();
    res.json({ message: "🛑 Bot Offline!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/delete', async (req, res) => {
  try {
    if (client.isReady()) await client.destroy();
    await BotConfig.destroy({ where: { id: 1 } });
    res.json({ message: "🗑️ Token Dihapus!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = { router, client, startBot };
