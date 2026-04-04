const express = require('express');
const router = express.Router();
const db = require('../models');

// Pastiin cuma Bos yang bisa akses rute ini
const cekBos = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ success: false, error: 'Lu bukan Bos!' });
};

// 1. Ambil semua data bot penyewa dari database
router.get('/bots', cekBos, async (req, res) => {
    try {
        const bots = await db.CustomBot.findAll();
        // Kalau database masih kosong, kirim array kosong aja biar gak loading terus
        res.json({ success: true, data: bots || [] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. Rute buat tombol "Nyalakan Bot Utama" (Yang ada di screenshot lu)
router.post('/update-main-bot', cekBos, async (req, res) => {
    try {
        const { token } = req.body;
        // Nanti logika manggil bot ditaruh di sini
        res.json({ success: true, message: "Instruksi diterima, mesin bot disiapkan!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
