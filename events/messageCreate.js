const db = require('../models');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        try {
            // findOrCreate: Tarik data server, kalau belum ada otomatis dibikinin pakai nilai default
            const [guildData] = await db.Guild.findOrCreate({
                where: { guild_id: message.guild.id },
                defaults: { prefix: '!', tier: 'basic' }
            });

            const prefix = guildData.prefix;
            const tier = guildData.tier;

            if (!message.content.startsWith(prefix)) return;

            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = client.commands.get(commandName);
            if (!command) return;

            // Eksekusi command sambil ngoper koneksi database (db)
            await command.execute(message, args, client, db, tier);

        } catch (error) {
            console.error('❌ Error di messageCreate:', error);
        }
    }
};
