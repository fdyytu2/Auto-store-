const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login', passport.authenticate('discord'));

// RUTE PELACAK DEBUGGING
router.get('/discord/callback', (req, res, next) => {
    passport.authenticate('discord', (err, user, info) => {
        if (err) {
            console.error("Auth Error:", err);
            return res.redirect('https://frontend-sultan.vercel.app/?error=database_crash');
        }
        if (!user) return res.redirect('https://frontend-sultan.vercel.app/?error=user_ditolak');
        
        req.logIn(user, (loginErr) => {
            if (loginErr) return res.redirect('https://frontend-sultan.vercel.app/?error=gagal_bikin_sesi');
            
            // KALAU SUKSES TOTAL
            return res.redirect('https://frontend-sultan.vercel.app/?status=berhasil_login');
        });
    })(req, res, next);
});

router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ success: true, user: req.user });
    } else {
        res.status(401).json({ success: false, message: 'Belum login' });
    }
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('https://frontend-sultan.vercel.app');
    });
});

module.exports = router;
