const express = require('express');
const router = express.Router();
const db = require('../models');

const cekBos = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') return next();
    res.status(403).json({ success: false, error: 'Lu bukan Bos!' });
};

router.get('/bots', cekBos, async (req, res) => {
    try {
        const bots = await db.CustomBot.findAll();
        res.json({ success: true, data: bots || [] });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get('/settings', cekBos, async (req, res) => {
    try {
        const setting = await db.Setting.findByPk(1);
        res.json(setting || {});
    } catch (err) { res.json({}); }
});

// 🟢 RUTE BARU: Cek Status Bot Real-Time
router.get('/bot-status', cekBos, (req, res) => {
    const bot = global.mainBot;
    // Kalau bot ada dan statusnya ready = Online
    if (bot && bot.isReady()) {
        res.json({ online: true });
    } else {
        res.json({ online: false });
    }
});

router.post('/control-main-bot', cekBos, async (req, res) => {
    try {
        const { action, token, activity } = req.body;
        const bot = global.mainBot;

        if (token) {
            const [setting] = await db.Setting.findOrCreate({ where: { id: 1 } });
            setting.botToken = token;
            await setting.save();
        }

        if (action === 'start') {
            if (bot && bot.isReady()) return res.json({ success: false, error: "Bot udah nyala bos!" });
            if (!token) return res.json({ success: false, error: "Token belum diisi!" });
            
            await bot.login(token);
            if (activity) bot.user.setActivity(activity);
            return res.json({ success: true, message: "🚀 Bot berhasil diterbangkan!" });
            
        } else if (action === 'stop') {
            // Langsung cabut kabel (destroy) biar pasti mati
            if (bot) bot.destroy(); 
            return res.json({ success: true, message: "🛑 Bot berhasil dimatikan!" });
            
        } else if (action === 'activity') {
            if (!bot || !bot.isReady()) return res.json({ success: false, error: "Nyalain bot dulu bre!" });
            
            bot.user.setActivity(activity || "Jualan PPOB Termurah");
            return res.json({ success: true, message: "🎮 Status 'Playing' berhasil diubah!" });
        }
    } catch (err) {
        console.error('🚨 ERROR KONTROL BOT:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// RUTE BARU: Hapus Bot Penyewa
router.delete('/delete-tenant/:id', cekBos, async (req, res) => {
    try {
        const tenantId = req.params.id;
        await db.CustomBot.destroy({ where: { ownerId: tenantId } });
        res.json({ success: true, message: 'Bot penyewa berhasil ditendang!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
