const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
let client = null;
let startTime = null;

const getBotInfo = () => {
  if (!client || !client.user) return null;
  return {
    name: client.user.username,
    avatar: client.user.displayAvatarURL(),
    status: "Online",
    activity: client.user.presence?.activities[0]?.name || "Growtopia", 
    startTime: startTime // Kita kirim Timestamp asli, bukan detik
  };
};

const startBot = async (token) => {
  if (client) return getBotInfo(); // Kalo udah jalan, balikin info aja
  
  client = new Client({ intents: [GatewayIntentBits.Guilds] });
  
  return new Promise((resolve, reject) => {
    client.login(token)
      .then(() => {
        startTime = Date.now();
        // INI YANG BIKIN STATUS DISCORD MUNCUL BENERAN 🗿
        client.user.setPresence({
          activities: [{ name: 'Growtopia', type: ActivityType.Playing }],
          status: 'online',
        });
        resolve(getBotInfo());
      })
      .catch(reject);
  });
};

const stopBot = () => {
  if (client) {
    client.destroy();
    client = null;
    startTime = null;
  }
  return { message: "Bot Stopped" };
};

module.exports = { startBot, stopBot, getBotInfo };
