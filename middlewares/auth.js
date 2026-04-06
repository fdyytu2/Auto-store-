const db = require('../models');

module.exports = {
    cekLogin: (req, res, next) => {
        if (req.session && req.session.user) return next();
        res.redirect('/login.html');
    },
    hanyaAdmin: (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role === 'admin') {
            return next();
        }
        res.status(403).json({ error: '🚫 Lu bukan Bos!' });
    },
    hanyaUltra: async (req, res, next) => {
        if (req.session.user && req.session.user.role === 'admin') return next();
        try {
            const sub = await db.Subscription.findOne({ where: { userId: req.session.user.id } });
            if (sub && sub.plan === 'ultra') return next();
            res.status(403).json({ success: false, error: '🚫 Khusus Ultra bre!' });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Server Error' });
        }
    },
    // 🔥 INI SATPAM BARU KHUSUS SULTAN (Pakai Passport.js & Railway Env)
    hanyaSultan: (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: '🚫 Belum login ke Discord bre!' });
        }
        
        if (req.user.id !== process.env.OWNER_ID) {
            return res.status(403).json({ error: '🚫 Akses Ditolak! Lu bukan Sultan Kora.' });
        }
        
        next(); // Kalau ID cocok, pintunya dibukain
    }
};
