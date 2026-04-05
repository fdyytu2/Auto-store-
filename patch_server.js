const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// 1. Tambah import passport
if(!content.includes("const passport = require('passport');")) {
    content = content.replace("const session = require('express-session');", "const session = require('express-session');\nconst passport = require('passport');");
}

// 2. Benerin Cookie Session (Hapus yang tabrakan)
content = content.replace(/cookie: \{[\s\S]*?\}/, "cookie: { secure: true, sameSite: 'none', httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }");

// 3. Tambah passport initialize (Wajib ditaruh setelah session)
if(!content.includes("app.use(passport.initialize())")) {
    content = content.replace("app.use(session({", "app.use(session({"); // Tetap di tempat
    content = content.replace("app.use(express.json());", "app.use(passport.initialize());\napp.use(passport.session());\napp.use(express.json());");
}

fs.writeFileSync('server.js', content);
console.log("✅ server.js berhasil di-patch!");
