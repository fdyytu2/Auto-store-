module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    // define your model attributes here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Add other attributes as needed
  });

  return Subscription;
};