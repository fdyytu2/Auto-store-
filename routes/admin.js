const express = require('express');
const router = express.Router();
const db = require('../models');

// Satpam khusus Bos
const cekBos = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ success: false, error: 'Lu bukan Bos!' });
};

// 1. Rute List Bot Penyewa
router.get('/bots', cekBos, async (req, res) => {
    try {
        const bots = await db.CustomBot.findAll();
        res.json({ success: true, data: bots || [] });
    } catch (err) {
        console.error('🚨 ERROR LOGIN BOT:', err); res.status(500).json({ success: false, error: err.message });
    }
});

// 2. Rute Ambil Settingan Token (Biar nongol pas loading)
router.get('/settings', cekBos, async (req, res) => {
    try {
        const setting = await db.Setting.findByPk(1);
        res.json(setting || {});
    } catch (err) {
        res.json({});
    }
});

// 3. Rute Kontrol Mesin Bot Utama (Start, Stop, Set Activity)
router.post('/control-main-bot', cekBos, async (req, res) => {
    try {
        const { action, token, activity } = req.body;
        const bot = global.mainBot; // Ambil mesin bot dari server.js

        // Simpan token ke database tiap kali ada perubahan
        if (token) {
            const [setting] = await db.Setting.findOrCreate({ where: { id: 1 } });
            setting.botToken = token;
            await setting.save();
        }

        if (action === 'start') {
            if (bot.isReady()) return res.json({ success: false, error: "Bot sudah menyala bos!" });
            if (!token) return res.json({ success: false, error: "Token belum diisi!" });
            
            await bot.login(token);
            if (activity) bot.user.setActivity(activity);
            return res.json({ success: true, message: "🚀 Bot berhasil diterbangkan!" });
            
        } else if (action === 'stop') {
            if (!bot.isReady()) return res.json({ success: false, error: "Bot emang lagi mati." });
            
            bot.destroy(); // Putus koneksi dari Discord
            return res.json({ success: true, message: "🛑 Bot berhasil dimatikan!" });
            
        } else if (action === 'activity') {
            if (!bot.isReady()) return res.json({ success: false, error: "Nyalain bot dulu baru bisa ganti status!" });
            
            bot.user.setActivity(activity || "Jualan PPOB Termurah");
            return res.json({ success: true, message: "🎮 Status 'Playing' berhasil diubah!" });
        }

    } catch (err) {
        console.error('🚨 ERROR LOGIN BOT:', err); res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
