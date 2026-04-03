const express = require('express');
const path = require('path');
const db = require('./models');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Buka jalur untuk nampilin website Dashboard HTML
app.use(express.static(path.join(__dirname, 'public')));

// API Cek Pengaturan
app.get('/api/settings', async (req, res) => {
    let setting = await db.Setting.findByPk(1);
    res.json(setting || { message: "Belum ada pengaturan" });
});

// API Simpan Token
app.post('/api/update-token', async (req, res) => {
    try {
        const { botToken } = req.body;
        const [setting, created] = await db.Setting.findOrCreate({
            where: { id: 1 },
            defaults: { botToken: botToken, maintenanceMode: false }
        });

        if (!created) {
            setting.botToken = botToken;
            await setting.save();
        }

        res.json({ success: true, message: "✅ Token berhasil disimpan ke Database!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Web Dashboard nyala di port ${PORT}`));
