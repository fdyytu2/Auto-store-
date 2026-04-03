const express = require('express');
const db = require('./models');
const app = express();

// Biar express bisa baca data dari form website
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rute untuk mengecek status pengaturan
app.get('/api/settings', async (req, res) => {
    let setting = await db.Setting.findByPk(1);
    res.json(setting || { message: "Belum ada pengaturan" });
});

// Rute Super Admin buat nyimpen/update Token Bot
app.post('/api/update-token', async (req, res) => {
    try {
        const { botToken } = req.body;
        
        // Cari atau buat baru
        const [setting, created] = await db.Setting.findOrCreate({
            where: { id: 1 },
            defaults: { botToken: botToken, maintenanceMode: false }
        });

        // Kalau udah ada, update tokennya
        if (!created) {
            setting.botToken = botToken;
            await setting.save();
        }

        res.json({ success: true, message: "✅ Token berhasil diupdate dari Dashboard!", token: setting.botToken });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Dashboard Server nyala di port ${PORT}`);
});
