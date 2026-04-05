const express = require('express');
const router = express.Router();

// Middleware Satpam Admin
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Akses Ditolak!' });
};

// Saklar Start/Stop
router.post('/control-main-bot', isAdmin, async (req, res) => {
    const { action, token } = req.body;
    if (!global.mainBot) return res.status(500).json({ message: 'Mesin bot mati.' });

    try {
        if (action === 'start') {
            if (!token) return res.status(400).json({ message: 'Token kosong!' });
            
            // Cek status koneksi (0 = Ready)
            if (global.mainBot.ws.status === 0) {
                return res.json({ success: true, message: 'Bot emang udah online Bos!' });
            }

            await global.mainBot.login(token);
            return res.json({ success: true, message: '🚀 Bot Master Online!' });

        } else if (action === 'stop') {
            global.mainBot.destroy();
            return res.json({ success: true, message: '🛑 Bot Master Offline!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Radar Status (Dibuat lebih peka)
router.get('/bot-status', (req, res) => {
    // 0 artinya bot sedang terkoneksi sempurna ke Discord
    const isOnline = global.mainBot && global.mainBot.ws.status === 0;
    res.json({ success: true, online: isOnline });
});

module.exports = router;
