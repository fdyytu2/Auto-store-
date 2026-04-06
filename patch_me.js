const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const newApiMe = `
const { Subscription } = require('./models');

app.get('/api/me', async (req, res) => {
  if (req.user) {
    const isSultan = req.user.id === process.env.OWNER_ID;
    let userTier = 'basic'; // Default kasta rakyat jelata
    
    try {
      // Cari kasta user di database
      const sub = await Subscription.findOne({ where: { userId: req.user.id } });
      if (sub) {
        userTier = sub.plan; // Bisa basic, advance, pro, atau ultra
      } else {
        // Kalau belum ada datanya, bikinin kasta basic otomatis
        await Subscription.create({ userId: req.user.id, plan: 'basic' });
      }
    } catch (err) {
      console.error("Gagal ngecek kasta:", err);
    }

    res.json({ 
      id: req.user.id,
      username: req.user.global_name || req.user.username,
      avatar: req.user.avatar ? \`https://cdn.discordapp.com/avatars/\${req.user.id}/\${req.user.avatar}.webp\` : 'https://cdn.discordapp.com/embed/avatars/0.png',
      isSultan: isSultan,
      tier: userTier // 🔥 INI DATA KASTA YANG DIKIRIM KE VERCEL
    });
  }
  else res.status(401).json({ error: "Belum login" });
});
`;

// Replace bagian app.get('/api/me' ... ) yang lama
code = code.replace(/app\.get\('\/api\/me'[\s\S]*?\}\);/, newApiMe);
fs.writeFileSync('server.js', code);
console.log("✅ API /me berhasil di-upgrade pakai kasta!");
