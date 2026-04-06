module.exports = (sequelize, DataTypes) => {
  const Deposit = sequelize.define('Deposit', {
    // Define attributes
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    // Additional attributes can be defined here
  });

  return Deposit;
};