const express = require('express');
const router = express.Router();

// Rute buat ngasih tau web frontend siapa yang lagi login
router.get('/me', (req, res) => {
    // Cek apakah ada sesi user (dari login Discord atau Pintu Bos)
    if (req.session && req.session.user) {
        res.json({ 
            success: true, 
            user: req.session.user 
        });
    } else {
        res.status(401).json({ success: false, message: 'Lu belum login bre!' });
    }
});

module.exports = router;
