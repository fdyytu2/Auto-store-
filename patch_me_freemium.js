const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const newApiMe = `
const { Subscription } = require('./models');

app.get('/api/me', async (req, res) => {
  if (req.user) {
    const isSultan = req.user.id === process.env.OWNER_ID;
    let userTier = 'user'; // Default kasta beneran rakyat biasa (belum langganan)
    
    try {
      // Cek apakah dia udah beli langganan
      const sub = await Subscription.findOne({ where: { userId: req.user.id } });
      if (sub && sub.plan) {
        userTier = sub.plan; // Kalau ada, ganti jadi basic/advance/pro/ultra
      }
    } catch (err) {
      console.error("Gagal ngecek kasta:", err);
    }

    res.json({ 
      id: req.user.id,
      username: req.user.global_name || req.user.username,
      avatar: req.user.avatar ? \`https://cdn.discordapp.com/avatars/\${req.user.id}/\${req.user.avatar}.webp\` : 'https://cdn.discordapp.com/embed/avatars/0.png',
      isSultan: isSultan,
      tier: userTier
    });
  }
  else res.status(401).json({ error: "Belum login" });
});
`;

// Timpa API /me yang lama
code = code.replace(/app\.get\('\/api\/me'[\s\S]*?\}\);/, newApiMe);
fs.writeFileSync('server.js', code);
console.log("✅ Konsep Freemium berhasil dipasang di Backend!");
