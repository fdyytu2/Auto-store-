module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`🤖 Bot siap melayani! Login sebagai: ${client.user.tag}`);
    }
};
