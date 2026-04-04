const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route Login
router.get('/discord', passport.authenticate('discord'));

// Callback setelah login sukses
router.get('/discord/callback', 
    passport.authenticate('discord', { failureRedirect: 'https://kora-bot.vercel.app' }), 
    (req, res) => {
        // SETELAH SUKSES: Paksa lempar ke dashboard Vercel
        res.redirect('https://kora-bot.vercel.app');
    }
);

// Cek User Me
router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ success: true, user: req.user });
    } else {
        res.status(401).json({ success: false, message: 'Belum login' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('https://kora-bot.vercel.app');
    });
});

module.exports = router;
