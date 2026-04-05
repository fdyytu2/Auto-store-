const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// Ganti settingan CORS biar super longgar buat ngetes
const newCors = `app.use(cors({
  origin: ['https://sultan.vercel.app', 'http://localhost:5173'], // Ganti sultan.vercel.app sama URL asli lu
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));`;

// Cari bagian app.use(cors... dan timpa
content = content.replace(/app\.use\(cors\([\s\S]*?\)\);/, newCors);
fs.writeFileSync('server.js', content);
