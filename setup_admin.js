const { db } = require('./db');

db.serialize(() => {
    db.run("INSERT OR REPLACE INTO Settings (key, value) VALUES ('admin_username', 'admin')");
    db.run("INSERT OR REPLACE INTO Settings (key, value) VALUES ('admin_password', 'rahasia123')");
    console.log("✅ Akun Super Admin berhasil dibuat!\n👉 Username: admin\n👉 Password: rahasia123");
    db.close();
});
