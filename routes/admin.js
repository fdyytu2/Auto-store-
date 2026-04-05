const express = require('express');
const router = express.Router();
const db = require('../models');
const { DataTypes } = require('sequelize');

// Bypass loading model BotConfig
if (!db.BotConfig) {
    db.BotConfig = require('../models/botconfig')(db.sequelize, DataTypes);
}

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') return next();
    return res.status(403).json({ success: false, message: 'Akses Ditolak!' });
};

router.post('/control-main-bot', isAdmin, async (req, res) => {
    const { action, token } = req.body;
    try {
        if (action === 'start') {
            let finalToken = token;
            // Jika ada token baru dikirim, simpan permanen
            if (token) {
                await db.BotConfig.upsert({ key: 'MASTER_TOKEN', value: token });
                finalToken = token;
            } else {
                const saved = await db.BotConfig.findOne({ where: { key: 'MASTER_TOKEN' } });
                if (saved) finalToken = saved.value;
            }

            if (!finalToken) return res.status(400).json({ message: 'Token belum ada!' });
            
            if (global.mainBot.ws.status === 0) return res.json({ success: true, message: 'Bot sudah online!' });
            
            await global.mainBot.login(finalToken);
            return res.json({ success: true, message: '🚀 Bot Berhasil Online!' });

        } else if (action === 'stop') {
            if (global.mainBot) global.mainBot.destroy();
            return res.json({ success: true, message: '🛑 Bot Berhasil Offline!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/bot-status', async (req, res) => {
    try {
        const isOnline = global.mainBot ? global.mainBot.ws.status === 0 : false;
        const savedToken = await db.BotConfig.findOne({ where: { key: 'MASTER_TOKEN' } });
        res.json({ success: true, online: isOnline, hasToken: !!savedToken });
    } catch (err) {
        res.json({ success: false, online: false, hasToken: false });
    }
});

module.exports = router;
