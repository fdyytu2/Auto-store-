const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

// 1. Hapus SEMUA tulisan const { Subscription } yang ada di file
code = code.replace(/const\s+\{\s*Subscription\s*\}\s*=\s*require\('\.\/models'\);/g, '');

// 2. Taruh SATU aja di bagian paling atas (di bawah require express)
code = code.replace(/(const express = require\('express'\);)/, "$1\nconst { Subscription } = require('./models');");

fs.writeFileSync('server.js', code);
console.log("✅ Syntax Error berhasil dibasmi! KTP ganda udah dihapus.");
