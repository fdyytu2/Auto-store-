const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const db = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: 'https://auto-store-production-9468.up.railway.app/api/auth/discord/callback',
    scope: ['identify', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Cari atau bikin user baru di database
      let [user] = await db.User.findOrCreate({
        where: { discordId: profile.id },
        defaults: {
          username: profile.username,
          avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
          email: profile.email
        }
      });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));
