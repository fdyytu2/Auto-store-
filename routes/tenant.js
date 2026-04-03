const express = require('express');
const router = express.Router();
const db = require('../models');
const { cekLogin, hanyaUltra } = require('../middlewares/auth');

// Hanya User ULTRA yang bisa nembus jalur ini
router.post('/update-token', cekLogin, hanyaUltra, async (req, res) => {
    const { botToken } = req.body;
    try {
        const [bot, created] = await db.CustomBot.findOrCreate({
            where: { ownerId: req.session.user.id },
            defaults: { botToken: botToken }
        });
        
        if (!created) {
            bot.botToken = botToken;
            await bot.save();
        }

        res.json({ success: true, message: '✅ Bot Ultra lu berhasil diupdate!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
