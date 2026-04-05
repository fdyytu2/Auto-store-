const express = require('express');
const router = express.Router();
const db = require('../models');

// Middleware Satpam Admin
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') return next();
    return res.status(403).json({ success: false, message: 'Akses Ditolak!' });
};

// Saklar Start/Stop & Simpan Token
router.post('/control-main-bot', isAdmin, async (req, res) => {
    const { action, token } = req.body;
    
    try {
        if (action === 'start') {
            let botToken = token;
            
            // 1. Kalau lu masukin token baru, simpan ke database!
            if (token) {
                let setting = await db.BotConfig.findOne({ where: { key: 'MASTER_BOT_TOKEN' } });
                if (setting) {
                    setting.value = token;
                    await setting.save();
                } else {
                    await db.BotConfig.create({ key: 'MASTER_BOT_TOKEN', value: token });
                }
            } else {
                // 2. Kalau kotak token dikosongin, cari di database!
                const savedToken = await db.BotConfig.findOne({ where: { key: 'MASTER_BOT_TOKEN' } });
                if (savedToken) botToken = savedToken.value;
            }

            if (!botToken) return res.status(400).json({ message: 'Token belum diisi dan belum ada di database!' });
            if (!global.mainBot) return res.status(500).json({ message: 'Mesin bot mati.' });
            if (global.mainBot.ws.status === 0) return res.json({ success: true, message: 'Bot emang udah online Bos!' });

            await global.mainBot.login(botToken);
            return res.json({ success: true, message: '🚀 Bot Master Online & Token Tersimpan!' });

        } else if (action === 'stop') {
            if(global.mainBot) global.mainBot.destroy();
            return res.json({ success: true, message: '🛑 Bot Master Offline!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Radar Status (Sekarang ngecek token juga)
router.get('/bot-status', async (req, res) => {
    try {
        const isOnline = global.mainBot ? global.mainBot.ws.status === 0 : false;
        // Cek apakah token udah ada di lemari database
        const savedToken = await db.BotConfig.findOne({ where: { key: 'MASTER_BOT_TOKEN' } });
        
        // Kita kirim hasToken ke frontend biar React tau kapan harus nyembunyiin kotak input
        res.json({ success: true, online: isOnline, hasToken: !!savedToken });
    } catch (error) {
        res.json({ success: false, online: false, hasToken: false });
    }
});

module.exports = router;
