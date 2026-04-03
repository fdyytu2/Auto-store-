const express = require('express');
const router = express.Router();
const db = require('../models');
const { cekLogin } = require('../middlewares/auth');

// Ambil semua daftar bot penyewa
router.get('/bots', cekLogin, async (req, res) => {
    try {
        // Nanti bisa ditambah: if (req.session.user.role !== 'admin') return error;
        const bots = await db.CustomBot.findAll();
        res.json({ success: true, data: bots });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
