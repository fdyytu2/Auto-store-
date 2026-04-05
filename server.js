const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const DiscordStrategy = require('passport-discord').Strategy;
const { BotConfig } = require('./db');
const { client } = require('./bot-routes'); 
require('dotenv').config();

const app = express();
const botRoutes = require('./bot-routes');

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

// Cookie Sultan biar Vercel kenal siapa lu
app.use(cors({ 
    origin: ['http://localhost:5173', 'https://frontend-sultan.vercel.app'], 
    credentials: true 
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.set('trust proxy', 1); // Wajib buat Railway

app.use('/api/bot-master', botRoutes);

// Auth Routes
app.get('/api/auth/discord', passport.authenticate('discord'));
app.get('/api/auth/callback', passport.authenticate('discord', {
    failureRedirect: 'https://frontend-sultan.vercel.app'
}), (req, res) => {
    res.redirect('https://frontend-sultan.vercel.app/dashboard');
});

app.get('/api/me', (req, res) => {
  if (req.user) res.json({ username: req.user.global_name || req.user.username });
  else res.status(401).json({ error: "Belum login" });
});

// LOGIKA CERDAS: Auto-Start & Auto-Clean Invalid Token
async function autoStartSultan() {
  try {
    const config = await BotConfig.findByPk(1);
    if (config && config.token) {
      console.log("🤖 [AUTO-START] Ada token, mencoba login...");
      try {
        await client.login(config.token);
        console.log("✅ [AUTO-START] Kora Online!");
      } catch (err) {
        console.log("❌ [AUTO-START] Token BUSUK! Menghapus dari database...");
        await config.destroy();
      }
    }
  } catch (err) { console.error("⚠️ [AUTO-START] Gagal akses DB"); }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 BACKEND READY DI PORT ${PORT}!`);
  await autoStartSultan();
});
