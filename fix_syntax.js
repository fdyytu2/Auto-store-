const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// Kita sapu bersih komentar sisa dan ekor kodingan yang nyangkut beserta kurung tutupnya
content = content.replace(/\/\/ BOM MINI:[\s\S]*?bersih!'\)\);\s*\}/g, '');

// Jaga-jaga kalau komentarnya udah ilang, kita sikat sisa ekornya aja
content = content.replace(/\)\.then\(\(\) => console\.log\('💣 Tabel Setting berhasil di-reset bersih!'\)\);\s*\}/g, '');

fs.writeFileSync('server.js', content);
console.log("✅ Operasi sukses! Ekor kodingan nyasar udah dibuang ke tong sampah.");
