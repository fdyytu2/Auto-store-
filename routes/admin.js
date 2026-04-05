const express = require('express');
const router = express.Router();

// Middleware: Satpam khusus ngecek KTP Admin
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Akses Ditolak! Khusus Sultan (Admin).' });
};

// Saklar Start/Stop Master Engine
router.post('/control-main-bot', isAdmin, async (req, res) => {
    const { action, token } = req.body;
    const mainBot = global.mainBot; // Ngambil instance bot dari server.js

    if (!mainBot) return res.status(500).json({ success: false, message: 'Sistem bot belum siap di server.' });

    try {
        if (action === 'start') {
            if (!token) return res.status(400).json({ success: false, message: 'Token bot Discord wajib diisi Bos!' });
            
            if (mainBot.isReady()) {
                return res.status(200).json({ success: false, message: 'Bot Master udah online bre!' });
            }

            await mainBot.login(token);
            return res.json({ success: true, message: '🚀 Bot Master berhasil dihidupkan!' });

        } else if (action === 'stop') {
            if (!mainBot.isReady()) {
                return res.status(200).json({ success: false, message: 'Bot Master emang lagi mati bre.' });
            }

            mainBot.destroy(); // Putus koneksi dari Discord
            return res.json({ success: true, message: '🛑 Bot Master berhasil dimatikan!' });
        } else {
            return res.status(400).json({ success: false, message: 'Aksi tidak dikenal.' });
        }
    } catch (error) {
        console.error('Error control bot:', error);
        return res.status(500).json({ success: false, message: `Gagal: ${error.message}` });
    }
});

// Radar Status (Frontend bakal nanya ke sini tiap 5 detik)
router.get('/bot-status', (req, res) => {
    const isOnline = global.mainBot ? global.mainBot.isReady() : false;
    res.json({ success: true, online: isOnline });
});

module.exports = router;
