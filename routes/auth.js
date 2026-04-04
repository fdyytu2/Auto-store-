const express = require('express');
const db = require('../models');
const router = express.Router();
const errorLogger = require('../utils/errorLogger');

// 1. Rute pas user ngeklik "Login"
router.get('/login', (req, res) => {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = process.env.DISCORD_CALLBACK_URL;
    
    // Cegat kalau KTP dari Railway masih kosong
    if (!clientId || !redirectUri) {
        errorLogger.catatError("Sistem gagal baca DISCORD_CLIENT_ID atau DISCORD_CALLBACK_URL dari Railway.");
        return res.status(500).send("🚨 Sistem sedang gangguan config. Lapor ke Admin!");
    }

    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;
    res.redirect(url);
});

// 2. Rute pas Discord ngebalikin data user (Callback)
router.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send("❌ Login dibatalkan atau gagal dapet kode dari Discord.");

    try {
        // Tukar kode dengan Token Akses
        const params = new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.DISCORD_CALLBACK_URL
        });

        const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const tokenData = await tokenRes.json();

        if (tokenData.error) {
            errorLogger.catatError(`Gagal tukar token: ${JSON.stringify(tokenData)}`);
            return res.send("❌ Gagal verifikasi token Discord. Pastikan Client Secret bener!");
        }

        // Ambil profil Discord User
        const userRes = await fetch('https://discord.com/api/users/@me', {
            headers: { authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = await userRes.json();

        // Tentukan apakah dia Owner atau Penyewa biasa
        const role = (userData.id === process.env.OWNER_ID) ? 'admin' : 'user';

        // Simpan atau Update data user di Database lu
        const [user, created] = await db.User.findOrCreate({
            where: { discordId: userData.id },
            defaults: { username: userData.username, role: role }
        });

        // Pasang sesi login (biar dashboard mengenali user ini)
        req.session.passport = { 
            user: { id: user.discordId, username: user.username, role: user.role } 
        };

        // Sukses! Lempar ke Dashboard
        res.redirect('/user-panel.html');

    } catch (err) {
        errorLogger.catatError(`Auth Crash: ${err.message}`);
        res.status(500).send("❌ Terjadi kesalahan sistem saat login.");
    }
});

// Rute buat Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.send("✅ Lu udah berhasil logout!");
});

module.exports = router;
