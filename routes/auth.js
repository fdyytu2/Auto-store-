const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login', passport.authenticate('discord'));

router.get('/discord/callback', 
    passport.authenticate('discord', { failureRedirect: 'https://frontend-sultan.vercel.app' }), 
    (req, res) => {
        // Balik ke frontend setelah sukses
        res.redirect('https://frontend-sultan.vercel.app');
    }
);

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('https://frontend-sultan.vercel.app');
    });
});

module.exports = router;
