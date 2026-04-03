const express = require('express');
const session = require('express-session');
const path = require('path');
const config = require('./config');
const db = require('./models'); // Tarik koneksi database ORM

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}));

const { cekLoginWeb } = require('./middlewares/auth');
const adminRoutes = require('./routes/admin');

// Endpoint Auth
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const dbUser = await db.Setting.findByPk('admin_username');
    const dbPass = await db.Setting.findByPk('admin_password');

    if (dbUser && dbPass && username === dbUser.value && password === dbPass.value) {
        req.session.loggedIn = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Username atau Password salah!' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Pasang rute admin ke Express
app.use('/api', adminRoutes);

// Rute Tampilan HTML
app.get('/dashboard', cekLoginWeb, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/', (req, res) => {
    res.redirect(req.session.loggedIn ? '/dashboard' : '/login.html');
});

// Nyalain Web
app.listen(config.port, () => {
    console.log(`🌐 Server Dashboard nyala di port ${config.port}`);
});
