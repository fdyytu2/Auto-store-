const db = require('../models');

module.exports = {
    cekLogin: (req, res, next) => {
        if (req.session && req.session.user) return next();
        res.redirect('/login.html');
    },
    // Filter Khusus Fitur Sultan
    hanyaUltra: async (req, res, next) => {
        const sub = await db.Subscription.findOne({ where: { userId: req.session.user.id } });
        if (sub && sub.plan === 'ultra') {
            return next();
        }
        res.status(403).json({ 
            success: false, 
            error: '🚫 Fitur ini khusus member ULTRA, bre! Silakan upgrade dulu.' 
        });
    }
};
