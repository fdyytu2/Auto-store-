const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

if (!content.includes("kentos5093")) {
    const suntikan = `console.log('✅ Database siap!');
    // AUTO ANGKAT SULTAN JADI ADMIN
    db.User.findOne({ where: { username: 'kentos5093' } }).then(user => {
        if (user && user.role !== 'admin') {
            user.role = 'admin';
            user.save();
            console.log('👑 SULTAN kentos5093 RESMI JADI ADMIN!');
        }
    }).catch(err => console.log('Gagal angkat admin:', err));`;
    
    content = content.replace("console.log('✅ Database siap!');", suntikan);
    fs.writeFileSync('server.js', content);
    console.log("✅ Kode Auto-Admin berhasil disuntik ke server.js!");
} else {
    console.log("⚠️ Kode sudah ada, lanjut push aja.");
}
