const express = require('express');
const router = express.Router();
const { Client, GatewayIntentBits } = require('discord.js');
const { BotConfig } = require('./db');

let client = null; // Gak usah bikin mesin dulu kalau belum dipanggil

// 📘 BUKU CATATAN SULTAN (State Management)
const botState = {
  status: "Offline", // Bisa: 'Offline', 'Starting', 'Online'
  name: "Bot Offline",
  avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
  isLocked: false // GEMBOK ANTI TABRAKAN
};

// Fungsi buat nulis ke buku catatan
const updateState = (status, name = "Bot Offline", avatar = "https://cdn.discordapp.com/embed/avatars/0.png") => {
  botState.status = status;
  botState.name = name;
  botState.avatar = avatar;
};

// 🤖 MESIN PENGGERAK UTAMA
const startBot = async (token) => {
  // Kalau digembok (lagi proses nyala), tolak biar gak tabrakan!
  if (botState.isLocked) {
    console.log("⚠️ [SISTEM] Ditolak, bot sedang diproses!");
    return false;
  }
  
  botState.isLocked = true; // Kunci gemboknya
  updateState("Starting...");

  try {
    // Kalau ada mesin lama yang nyangkut, hancurin dulu
    if (client) {
      await client.destroy();
    }
    
    // Bikin mesin baru yang fresh
    const { Partials } = require('discord.js');
    client = new Client({ 
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
      ],
      partials: [Partials.Channel, Partials.Message]
    });

    // Panggil otak perintah dari botManager biar dia gak bego
    const { startCustomBot } = require('./utils/botManager');
    startCustomBot(token, process.env.OWNER_ID); // Lempar ke mesin pintar

    
    return await new Promise((resolve) => {
      client.once('ready', (c) => {
        console.log(`✅ Kora Ready: ${c.user.tag}`);
        updateState("Online", c.user.username, c.user.displayAvatarURL());
        botState.isLocked = false; // Buka gembok
        resolve(true);
      });
      
      client.login(token).catch((err) => {
        console.error("❌ Login gagal:", err.message);
        updateState("Offline");
        botState.isLocked = false; // Buka gembok
        resolve(false);
      });
      
      // Auto-Batal kalau lebih dari 15 detik (Timeout)
      setTimeout(() => {
        if (botState.status !== "Online") {
          console.log("⏱️ Timeout! Discord server lola.");
          updateState("Offline");
          botState.isLocked = false;
          resolve(false);
        }
      }, 15000);
    });
  } catch (err) {
    updateState("Offline");
    botState.isLocked = false;
    return false;
  }
};

// 📡 API INFO (Secepat Kilat)
router.get('/info', async (req, res) => {
  try {
    const config = await BotConfig.findByPk(1);
    // Langsung baca buku catatan, gak usah mikirin client.user lagi!
    res.json({ 
      token: config?.token || null, 
      info: {
        name: botState.name,
        avatar: botState.avatar,
        status: botState.status
      }
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 🚀 API START/ADD
router.post('/add', express.json(), async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token kosong!" });
  if (botState.isLocked) return res.status(429).json({ error: "Sabar Bolo, bot lagi proses nyala!" });
  
  const success = await startBot(token);
  if (success) {
    await BotConfig.upsert({ id: 1, token });
    res.json({ info: { name: botState.name, avatar: botState.avatar, status: botState.status } });
  } else {
    res.status(400).json({ error: "Gagal Login! Token Invalid atau Timeout." });
  }
});

// 🛑 API STOP
router.post('/stop', async (req, res) => {
  try {
    if (client) await client.destroy();
    updateState("Offline");
    res.json({ message: "🛑 Bot Offline!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 🗑️ API DELETE
router.post('/delete', async (req, res) => {
  try {
    if (client) await client.destroy();
    await BotConfig.destroy({ where: { id: 1 } });
    updateState("Offline");
    res.json({ message: "🗑️ Token Dihapus!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = { router, client, startBot };
