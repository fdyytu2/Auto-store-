const fs = require('fs');
let content = fs.readFileSync('models/index.js', 'utf8');

// Tambahin konfigurasi dialectOptions buat SSL
const sslConfig = `dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },`;

// Cari bagian new Sequelize dan selipin sslConfig-nya
if (!content.includes('dialectOptions')) {
    content = content.replace('host: process.env.DB_HOST,', `host: process.env.DB_HOST,\n    ${sslConfig}`);
}

fs.writeFileSync('models/index.js', content);
console.log("✅ models/index.js berhasil di-update dengan SSL!");
