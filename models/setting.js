module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Nama pengaturan gak boleh kembar
    },
    value: {
      type: DataTypes.TEXT, // Pakai TEXT biar muat token yang panjang
      allowNull: false
    }
  });
  return Setting;
};
