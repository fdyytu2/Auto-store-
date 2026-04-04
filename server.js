const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const db = require('./models');
const errorLogger = require('./utils/errorLogger'); // Pakai logger yang udah kita bikin
require('dotenv').config();

const app = express();

// ==========================================
// 1. PENGATURAN WEB & SESSION
// ==========================================
app.use(session({
    secret: process.env.SESSION_SECRET || 'rahasia_sistem_ppob',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rute API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
// Jembatan buat nangkep error dari browser (Frontend)
app.post('/api/log-frontend', (req, res) => {
    const errorLogger = require('./utils/errorLogger');
    errorLogger.catatError(`[🌐 FRONTEND ERROR] di ${req.body.url}:
${req.body.message}`);
    res.json({ success: true });
});

// ==========================================
// 2. MESIN BOT UTAMA (COMMAND HANDLER)
// ==========================================
const botClient = new Client({ 
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] 
});

global.mainBot = botClient;
botClient.commands = new Collection();
// Baca semua file command
if (fs.existsSync('./commands')) {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        botClient.commands.set(command.name, command);
    }
}

botClient.on('messageCreate', (message) => {
    const prefix = '!'; 
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!botClient.commands.has(commandName)) return;

    try {
        botClient.commands.get(commandName).execute(message, args, db);
    } catch (error) {
        errorLogger.catatError(`Error Command ${commandName}: ${error.message}`);
        message.reply('❌ Terjadi kesalahan saat mengeksekusi perintah ini.');
    }
});

botClient.once('clientReady', () => {
    console.log(`🤖 Bot Utama [${botClient.user.tag}] Berhasil Online!`);
    errorLogger.catatError('✅ Sistem Bot & Web Dashboard berhasil menyala bersamaan!');
});

// ==========================================
// 3. STARTUP SISTEM (SYNC DB & JALANKAN)
// ==========================================
db.sequelize.sync({ alter: true }).then(async () => {
    console.log('✅ Database siap!');
    
    // Nyalain bot pakai Token Utama dari .env
    if (process.env.DISCORD_BOT_TOKEN) {
        botClient.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
            errorLogger.catatError(`Gagal Login Bot Utama: ${err.message}`);
        });
    } else {
        console.log('⚠️ DISCORD_BOT_TOKEN kosong di .env / Railway!');
    }

}).catch(err => console.error('Gagal sync DB:', err));

// Global Error Catcher (Biar web gak gampang crash)
process.on('uncaughtException', (err) => {
    errorLogger.catatError(`FATAL ERROR: ${err.message}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server Web nyala di port ${PORT}`));
