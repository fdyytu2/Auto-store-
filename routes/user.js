const express = require('express');
const router = express.Router();

// Rute buat ngasih tau web frontend siapa yang lagi login
router.get('/me', (req, res) => {
    // PAKE CARA PASSPORT.JS NGECEK LOGIN!
    if (req.isAuthenticated && req.isAuthenticated()) {
        res.json({
            success: true,
            user: req.user // Passport nyimpen datanya di req.user
        });
    } else {
        res.status(401).json({ success: false, message: 'Lu belum login bre!' });
    }
});

module.exports = router;
