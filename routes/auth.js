const express = require('express');
const db = require('../models');
const router = express.Router();
const errorLogger = require('../utils/errorLogger');

// ==========================================
// 1. JALUR DEPAN (DISCORD OAUTH BUAT PENYEWA)
// ==========================================
router.get('/login', (req, res) => {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = process.env.DISCORD_CALLBACK_URL;
    if (!clientId || !redirectUri) return res.send("🚨 Sistem Discord belum disetting Admin.");
    
    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;
    res.redirect(url);
});

router.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send("❌ Login dibatalkan.");

    try {
        const params = new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.DISCORD_CALLBACK_URL
        });
        const tokenRes = await fetch('https://discord.com/api/oauth2/token', { method: 'POST', body: params, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
        const tokenData = await tokenRes.json();
        
        const userRes = await fetch('https://discord.com/api/users/@me', { headers: { authorization: `Bearer ${tokenData.access_token}` }});
        const userData = await userRes.json();

        // Cek dia Owner atau User biasa
        const role = (userData.id === process.env.OWNER_ID) ? 'admin' : 'user';
        const [user] = await db.User.findOrCreate({ 
            where: { discordId: userData.id }, 
            defaults: { username: userData.username, role: role } 
        });

        // FIX SESI: Sekarang udah sinkron sama middlewares/auth.js lu
        req.session.user = { id: user.discordId, username: user.username, role: user.role };
        res.redirect('https://frontend-sultan.vercel.app');

    } catch (err) {
        errorLogger.catatError(`Login Discord Error: ${err.message}`);
        res.status(500).send("❌ Gagal login sistem.");
    }
});

// ==========================================
// 2. JALUR SILUMAN (PINTU BOS 99)
// ==========================================
// Nangkap form method="POST" dari pintu-bos-99.html
router.post('/login-env', (req, res) => {
    // Ambil password yang diketik di HTML
    const inputPassword = req.body.password; 
    // Ambil password rahasia dari brankas Railway
    const passwordAsli = process.env.ADMIN_PASSWORD; 

    if (!passwordAsli) {
        return res.send("🚨 Password Admin (ADMIN_PASSWORD) belum dibikin di Railway!");
    }

    if (inputPassword === passwordAsli) {
        // Kalau password bener, langsung tembak status jadi Bos
        req.session.user = { id: process.env.OWNER_ID || 'BOS', username: 'Sultan', role: 'admin' };
        
        // Pindahin ke halaman admin dashboard lu
        // (Sesuaikan sama nama file dashboard admin lu, ini gua asumsikan dashboard.html)
        res.redirect('https://frontend-sultan.vercel.app'); 
    } else {
        res.send("❌ Password salah bre! Siapa lu?");
    }
});

// ==========================================
// 3. JALUR KELUAR
// ==========================================
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('https://frontend-sultan.vercel.app');
});

module.exports = router;
