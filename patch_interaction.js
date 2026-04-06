const fs = require('fs');
const filePath = './utils/botManager.js';
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('client.on(\'interactionCreate\'')) {
    const interactionCode = `
    // 🔥 EVENT BARU: Penangkap Tombol & Modal Pop-up
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isButton()) {
            const { handleButton } = require('../interactions/buttonHandler');
            await handleButton(interaction, client, db);
        } else if (interaction.isModalSubmit()) {
            const { handleModal } = require('../interactions/modalHandler');
            await handleModal(interaction, client, db);
        }
    });
`;
    // Pasang sebelum catch try catch client.login
    content = content.replace('try {', interactionCode + '\n    try {');
    fs.writeFileSync(filePath, content);
    console.log("✅ botManager berhasil di-patch dengan mesin Interaction!");
} else {
    console.log("⚠️ Mesin interaction udah kepasang sebelumnya.");
}
