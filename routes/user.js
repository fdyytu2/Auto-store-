const express = require('express');
const router = express.Router();
const { CustomBot, Subscription } = require('../models');

// Ambil data settingan user saat ini
router.get('/config', async (req, res) => {
    try {
        const userId = req.session.passport.user.id;
        const botConfig = await CustomBot.findOne({ where: { ownerId: userId } });
        const sub = await Subscription.findOne({ where: { userId } });
        
        res.json({
            config: botConfig || {},
            plan: sub ? sub.plan : 'basic'
        });
    } catch (err) {
        res.status(500).json({ error: 'Gagal ambil data' });
    }
});

// Simpan settingan (Live Stock & AI Key)
router.post('/save-config', async (req, res) => {
    try {
        const userId = req.session.passport.user.id;
        const { liveStockChannel, botToken } = req.body;

        // Cari atau bikin baru kalau belum ada
        const [config, created] = await CustomBot.findOrCreate({
            where: { ownerId: userId },
            defaults: { liveStockChannel, botToken }
        });

        if (!created) {
            config.liveStockChannel = liveStockChannel;
            // Bot token cuma boleh diupdate kalau Ultra (nanti ditambahin proteksinya)
            config.botToken = botToken; 
            await config.save();
        }

        res.json({ message: 'Settingan berhasil disimpan, bre!' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal simpan data' });
    }
});

module.exports = router;
