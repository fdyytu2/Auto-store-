const express = require('express');
const path = require('path');
const fs = require('fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const db = require('./models');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// RADAR WEBHOOK DEBUGGER
// ==========================================
const sendWebhookLog = async (message, type = 'info') => {
    const webhookUrl = process.env.DISCORD_WEBHOOK;
    if (!webhookUrl) return;

    const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    let prefix = 'ℹ️ **[LOG ENGINE]**';
    if (type === 'error') prefix = '🚨 **[ERROR ENGINE]**';
    if (type === 'success') prefix = '✅ **[SUCCESS ENGINE]**';
    
    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: `${prefix} - 🗓️ \`${time}\`\n\`\`\`js\n${message}\n\`\`\`` })
        });
    } catch (e) { console.error('Gagal kirim webhook'); }
};

// ==========================================
// LOGIKA BOT DISCORD (COMMAND HANDLER)
// ==========================================
let botClient = null;

async function matikanBot() {
    if (botClient) {
        sendWebhookLog('Mematikan bot lama untuk ganti sesi...', 'info');
        botClient.destroy();
        botClient = null;
    }
}

async function jalankanBot(token) {
    await matikanBot();
    
    botClient = new Client({ 
        intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] 
    });

    // 1. Siapkan Laci buat nyimpen Command
    botClient.commands = new Collection();
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        botClient.commands.set(command.name, command);
    }

    // 2. Eksekusi Command saat ada pesan masuk
    botClient.on('messageCreate', (message) => {
        const prefix = '!'; // Nanti bisa lu atur dinamis per bot di database
        
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!botClient.commands.has(commandName)) return;

        try {
            // Operin pesan, argumen, dan koneksi database ke file command
            botClient.commands.get(commandName).execute(message, args, db);
        } catch (error) {
            console.error(error);
            message.reply('❌ Terjadi kesalahan saat mengeksekusi perintah ini.');
        }
    });

    try {
        await botClient.login(token);
        sendWebhookLog('Bot Auto Store Berhasil Online! Command siap digunakan.', 'success');
    } catch (err) {
        sendWebhookLog(err.stack || err.message, 'error');
    }
}

// ==========================================
// API DASHBOARD SUPER ADMIN
// ==========================================
app.post('/api/update-token', async (req, res) => {
    try {
        const { botToken } = req.body;
        const [setting] = await db.Setting.findOrCreate({ where: { id: 1 } });
        setting.botToken = botToken;
        await setting.save();

        sendWebhookLog('Token baru diterima dari Dashboard. Memulai ulang bot...', 'info');
        jalankanBot(botToken);

        res.json({ success: true, message: "✅ Token disimpan & Bot diaktifkan!" });
    } catch (err) {
        sendWebhookLog(err.message, 'error');
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/settings', async (req, res) => {
    let setting = await db.Setting.findByPk(1);
    res.json(setting || {});
});

db.sequelize.sync().then(async () => {
    const setting = await db.Setting.findByPk(1);
    if (setting && setting.botToken) {
        jalankanBot(setting.botToken);
    }
}).catch(err => sendWebhookLog(err.message, 'error'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server nyala di port ${PORT}`));
