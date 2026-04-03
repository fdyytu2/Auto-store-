const express = require('express');
const router = express.Router();
const db = require('../models');

// Ambil kunci dari environment
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI; // Contoh: https://[domain-railway]/api/auth/callback

// 1. Lempar user ke halaman login Discord
router.get('/login', (req, res) => {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20email`;
    res.redirect(url);
});

// 2. Discord ngelempar balik user bawa "Code" rahasia
router.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.redirect('/login.html?error=batal_login');

    try {
        // Tuker Code dengan Access Token
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        });

        const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const tokenData = await tokenRes.json();

        if (!tokenData.access_token) return res.redirect('/login.html?error=gagal_token');

        // Pake Token buat ngambil data Profil Discord si Penyewa
        const userRes = await fetch('https://discord.com/api/users/@me', {
            headers: { authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = await userRes.json();

        // SIMPAN KE DATABASE (Sesuai target Data Integrity lu!)
        const [user, created] = await db.User.findOrCreate({
            where: { discordId: userData.id },
            defaults: {
                username: userData.username,
                email: userData.email,
                saldo: 0,
                role: 'user' // Default role
            }
        });

        // Bikin tiket session
        req.session.user = {
            id: user.discordId,
            username: user.username,
            role: user.role,
            avatar: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : null
        };

        // Sukses? Lempar ke Dashboard!
        res.redirect('/dashboard.html');

    } catch (error) {
        console.error('Error saat SSO Discord:', error);
        res.redirect('/login.html?error=server_error');
    }
});

// Cek profil saat ini (buat nampil di web HTML)
router.get('/me', (req, res) => {
    if (!req.session.user) return res.status(401).json({ loggedIn: false });
    res.json({ loggedIn: true, user: req.session.user });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

module.exports = router;
