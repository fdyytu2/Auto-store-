const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const DiscordStrategy = require('passport-discord').Strategy;

// Import Database & Router
const { BotConfig } = require('./db');
const { Subscription } = require('./models');
const { router: botRoutes, startBot } = require('./bot-routes');
const { hanyaSultan } = require('./middlewares/auth');
require('dotenv').config();

const app = express();

// Konfigurasi Passport (Discord Login)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

// Middleware Standar
app.use(cors({
    origin: ['http://localhost:5173', 'https://frontend-sultan.vercel.app'],
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());
app.set('trust proxy', 1);

// Pintu Masuk Bot Master (Digembok khusus Sultan)
app.use('/api/bot-master', hanyaSultan, botRoutes);

// Pintu Masuk Auth Discord
app.get('/api/auth/discord', passport.authenticate('discord'));

// Polisi Lalu Lintas (Redirect Login)
app.get('/api/auth/callback', passport.authenticate('discord', {
    failureRedirect: 'https://frontend-sultan.vercel.app'
}), (req, res) => {
    if (req.user.id === process.env.OWNER_ID) {
        res.redirect('https://frontend-sultan.vercel.app/admin'); 
    } else {
        res.redirect('https://frontend-sultan.vercel.app/user'); 
    }
});

// 🔥 API PROFILE & KASTA (Udah Fix Async/Await!)
app.get('/api/me', async (req, res) => {
  if (req.user) {
    const isSultan = req.user.id === process.env.OWNER_ID;
    let userTier = 'user'; // Kasta rakyat jelata (Freemium)
    
    try {
      // Cek kasta user di database
      const sub = await Subscription.findOne({ where: { userId: req.user.id } });
      if (sub && sub.plan) {
        userTier = sub.plan;
      }
    } catch (err) {
      console.error("⚠️ Gagal ngecek kasta:", err.message);
    }

    res.json({ 
      id: req.user.id,
      username: req.user.global_name || req.user.username,
      avatar: req.user.avatar ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.webp` : 'https://cdn.discordapp.com/embed/avatars/0.png',
      isSultan: isSultan,
      tier: userTier
    });
  }
  else res.status(401).json({ error: "Belum login" });
});

// Fungsi Auto-Start Bot
async function autoStartSultan() {
  try {
    const config = await BotConfig.findByPk(1);
    if (config && config.token) {
      console.log("🤖 [AUTO-START] Mencoba login otomatis...");
      const ok = await startBot(config.token);
      if (!ok) {
        console.log("❌ [AUTO-START] Token busuk, hapus!");
        await config.destroy();
      } else { console.log("✅ [AUTO-START] Kora Online!"); }
    }
  } catch (err) { console.error("⚠️ [AUTO-START] DB Error"); }
}

// Nyalain Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 BACKEND READY! PORT: ${PORT}`);
  await autoStartSultan();
});
