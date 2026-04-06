const express = require('express');
const router = express.Router();
const { Client, GatewayIntentBits } = require('discord.js');
const { BotConfig } = require('./db');

let client = new Client({ intents: [GatewayIntentBits.Guilds] });

const startBot = async (token) => {
  try {
    // Kalau udah nyala, matiin dulu biar gak dobel
    if (client && client.isReady()) {
      await client.destroy();
    }
    
    // Bikin instance baru
    client = new Client({ intents: [GatewayIntentBits.Guilds] });
    
    return new Promise((resolve) => {
      // PAKE (c) BIAR GAK CRASH KETABRAK VARIABEL GLOBAL!
      client.once('clientReady', (c) => {
        console.log(`✅ Kora Ready: ${c.user.tag}`);
        resolve(true);
      });
      
      client.login(token).catch((err) => resolve(false));
      setTimeout(() => resolve(false), 15000);
    });
  } catch (err) {
    return false;
  }
};

router.get('/info', async (req, res) => {
  try {
    const config = await BotConfig.findByPk(1);
    // Tambah pengaman && client.user biar gak nembus pas lagi loading
    const isOnline = client && client.isReady() && client.user;
    
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
    // Pake pengaman juga di mari
    const safeName = client && client.user ? client.user.username : "Kora Bot";
    const safeAvatar = client && client.user ? client.user.displayAvatarURL() : "";
    res.json({ info: { name: safeName, avatar: safeAvatar, status: "Online" } });
  } else {
    res.status(400).json({ error: "Token Invalid!" });
  }
});

router.post('/stop', async (req, res) => {
  try {
    if (client && client.isReady()) await client.destroy();
    res.json({ message: "🛑 Bot Offline!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/delete', async (req, res) => {
  try {
    if (client && client.isReady()) await client.destroy();
    await BotConfig.destroy({ where: { id: 1 } });
    res.json({ message: "🗑️ Token Dihapus!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = { router, client, startBot };
