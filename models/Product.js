module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Product', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.INTEGER, defaultValue: 0 },
        stock: { type: DataTypes.INTEGER, defaultValue: 0 }
        // guild_id otomatis dibikin lewat relasi di index.js
    }, { timestamps: false });
};
