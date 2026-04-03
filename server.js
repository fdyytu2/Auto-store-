const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./models');
require('dotenv').config();

const app = express();

// Seting Memori Sesi (Tiket Login)
app.use(session({
    secret: process.env.SESSION_SECRET || 'rahasia_sistem_ppob',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // false karena belum pakai SSL strict di backend
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rute Login SSO Discord
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Folder Public (Frontend HTML lu)
// Catatan: Biar file statis bisa diakses tanpa login, tapi datanya dilindungi Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Sambung Database
db.sequelize.sync().then(() => {
    console.log('✅ Database siap melayani web server');
}).catch(err => console.error('Gagal sync DB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server Web & API nyala di port ${PORT}`));
