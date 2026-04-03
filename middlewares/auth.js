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
        // Kalau Bos (Admin) bebas masuk tanpa cek database
        if (req.session.user.role === 'admin') return next();

        // Kalau user biasa, cek database dia Ultra atau bukan
        try {
            const sub = await db.Subscription.findOne({ where: { userId: req.session.user.id } });
            if (sub && sub.plan === 'ultra') return next();
            res.status(403).json({ success: false, error: '🚫 Khusus Ultra bre!' });
        } catch (err) {
            res.status(500).json({ success: false, error: 'Server Error' });
        }
    }
};
