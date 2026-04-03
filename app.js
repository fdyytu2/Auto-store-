const express = require('express');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const db = require('./models');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- LOGIKA BOT ---
let botClient = null;

async function matikanBot() {
    if (botClient) {
        console.log('🔄 Mematikan bot lama...');
        botClient.destroy();
        botClient = null;
    }
}

async function jalankanBot(token) {
    await matikanBot();
    
    botClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
    
    try {
        console.log('🟢 Mencoba login bot...');
        await botClient.login(token);
        console.log('🚀 Bot Utama Online!');
    } catch (err) {
        console.error('❌ Gagal login bot:', err.message);
    }
}

// --- API DASHBOARD ---
app.post('/api/update-token', async (req, res) => {
    try {
        const { botToken } = req.body;
        
        // Simpan ke Database
        const [setting] = await db.Setting.findOrCreate({ where: { id: 1 } });
        setting.botToken = botToken;
        await setting.save();

        // LANGSUNG JALANKAN BOT!
        jalankanBot(botToken);

        res.json({ success: true, message: "✅ Token disimpan & Bot sedang diaktifkan!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/settings', async (req, res) => {
    let setting = await db.Setting.findByPk(1);
    res.json(setting || {});
});

// Jalankan bot otomatis pas awal server nyala (kalau token udah ada)
db.sequelize.sync().then(async () => {
    const setting = await db.Setting.findByPk(1);
    if (setting && setting.botToken) {
        jalankanBot(setting.botToken);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server & Bot Engine nyala di port ${PORT}`));
