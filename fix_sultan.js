const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// 1. Ganti 'force: true' balik ke 'alter: true' (Matikan bom biar data gak ilang lagi)
content = content.replace('force: true', 'alter: true');

// 2. Pastikan script pengangkat Admin otomatis ada
if (!content.includes('kentos5093')) {
    const adminSuntik = `
    // AUTO ANGKAT SULTAN JADI ADMIN
    db.User.findOne({ where: { username: 'kentos5093' } }).then(user => {
        if (user && user.role !== 'admin') {
            user.role = 'admin';
            user.save();
            console.log('👑 SULTAN kentos5093 KEMBALI BERTAHTA!');
        }
    }).catch(err => console.log('Gagal angkat admin:', err));`;
    
    // Selipin setelah database siap
    content = content.replace("console.log('✅ Database siap!');", "console.log('✅ Database siap!');" + adminSuntik);
}

fs.writeFileSync('server.js', content);
console.log("✅ Bom dimatikan & Tahta Sultan disiapkan!");
