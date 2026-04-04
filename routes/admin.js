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
        res.status(500).json({ success: false, error: err.message });
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

// 3. Rute Simpan Token Bot Utama
router.post('/update-main-bot', cekBos, async (req, res) => {
    try {
        const { token } = req.body;
        const [setting] = await db.Setting.findOrCreate({ where: { id: 1 } });
        setting.botToken = token;
        await setting.save();
        
        // Nanti logika start bot Discord di-trigger di sini
        
        res.json({ success: true, message: "Token berhasil disimpan ke Database!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
