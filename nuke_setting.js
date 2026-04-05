const fs = require('fs');

// 1. Pastikan rute admin bersih dari kata Setting
let adminContent = fs.readFileSync('routes/admin.js', 'utf8');
adminContent = adminContent.replace(/db\.Setting/g, 'db.BotConfig');
fs.writeFileSync('routes/admin.js', adminContent);

// 2. Hapus file cetakan Setting yang dikutuk itu (mengabaikan huruf besar/kecil)
const files = fs.readdirSync('models');
const settingFile = files.find(f => f.toLowerCase() === 'setting.js');
if (settingFile) {
    fs.unlinkSync(`models/${settingFile}`);
    console.log(`✅ File ${settingFile} berhasil dimusnahkan dari muka bumi!`);
}

// 3. Bersihkan server.js dari script Bom Mini kemarin
let serverContent = fs.readFileSync('server.js', 'utf8');
serverContent = serverContent.replace(/if\s*\(\s*db\.Setting\s*\)\s*\{[\s\S]*?\}\s*/g, '');
fs.writeFileSync('server.js', serverContent);

console.log("✅ Pembersihan total selesai! Backend sekarang 100% pakai BotConfig.");
