const { spawn } = require('child_process');

console.log('🚀 Memulai Engine Auto Store (Bot + Dashboard)...\n');

const webServer = spawn('node', ['server.js'], { stdio: 'inherit' });
const discordBot = spawn('node', ['index.js'], { stdio: 'inherit' });

process.on('SIGINT', () => {
    console.log('\n🛑 Mematikan semua proses...');
    webServer.kill();
    discordBot.kill();
    process.exit();
});
