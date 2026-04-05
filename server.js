const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const DiscordStrategy = require('passport-discord').Strategy;
require('dotenv').config();

const app = express();
const botRoutes = require('./bot-routes');

// Konfigurasi Passport
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

app.use(cors({ origin: ['https://frontend-sultan.vercel.app', 'https://frontend-sultan.vercel.app'], credentials: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/bot-master', botRoutes);

// Log Monitor
app.use((req, res, next) => {
  if (req.url !== '/favicon.ico') console.log(`📩 [LOG] ${req.method} ${req.url}`);
  next();
});

// Route Auth Beneran
app.get('/api/auth/discord', passport.authenticate('discord'));

app.get('/api/auth/callback', passport.authenticate('discord', {
    failureRedirect: 'https://frontend-sultan.vercel.app'
}), (req, res) => {
    console.log("✅ [SUCCESS] User Berhasil Login!");
    res.redirect('https://frontend-sultan.vercel.app/dashboard'); // Lempar ke dashboard frontend
});

app.use((err, req, res, next) => {
  if (err && err.name === 'TokenError') {
    console.log("⚠️ [WARN] Kode Discord hangus/expired. Redirect ke Home...");
    return res.redirect('https://frontend-sultan.vercel.app');
  }
  next(err);
});
// API buat ambil token yang udah ada
app.get('/api/token-master', async (req, res) => {
  try {
    // Di sini nanti lu ganti pake query database beneran (Sequelize/PG)
    // Untuk sekarang kita balikin data placeholder
    res.json({ token: "MTIzNDU2Nzg5..." }); 
  } catch (err) {
    res.status(500).json({ error: "Gagal ambil token" });
  }
});

// API buat simpen token baru
app.post('/api/token-master', express.json(), async (req, res) => {
  const { token } = req.body;
  console.log("💾 [DB] Token Master baru disimpan:", token);
  // Di sini nanti proses INSERT ke database Railway lu
  res.json({ message: "Token berhasil disimpan ke database!" });
});
// API buat nampilin profil lu
app.get('/api/me', (req, res) => {
  if (req.user) {
    // Kalau udah login, kirim namanya
    res.json({ username: req.user.global_name || req.user.username });
  } else {
    res.status(401).json({ error: "Belum login" });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log("\n🚀 BACKEND READY! DISCORD AUTH AKTIF.");
});
