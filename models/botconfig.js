module.exports = (sequelize, DataTypes) => {
  const BotConfig = sequelize.define('BotConfig', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });
  return BotConfig;
};
