const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./models');
require('dotenv').config();

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET || 'rahasia_sistem_ppob',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rute-rute API Lu
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin'); // BARU

app.use('/api/auth', authRoutes);
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', adminRoutes); // BARU

app.use(express.static(path.join(__dirname, 'public')));

db.sequelize.sync().then(() => {
    console.log('✅ Database siap melayani web server');
}).catch(err => console.error('Gagal sync DB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server Web & API nyala di port ${PORT}`));
