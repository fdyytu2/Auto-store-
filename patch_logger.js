const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

if (!content.includes('process.on(\'unhandledRejection\')')) {
    const loggerSetup = `
const { reportError } = require('./lib/logger');

// Jaring Error Global (Backend)
process.on('unhandledRejection', (reason, promise) => {
    reportError(reason, 'Unhandled Rejection (Janji Palsu API)');
});

process.on('uncaughtException', (error) => {
    reportError(error, 'Uncaught Exception (Kabel Putus Fatal)');
});
`;
    fs.appendFileSync('server.js', loggerSetup);
    console.log("✅ Jaring monitoring error berhasil dipasang!");
} else {
    console.log("⚠️ Jaring error sudah ada.");
}
