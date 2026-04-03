module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        // Karena 1 user bisa belanja di banyak server dengan saldo beda-beda, 
        // kita jadiin user_id dan guild_id sebagai Primary Key gabungan.
        user_id: { type: DataTypes.STRING, primaryKey: true },
        guild_id: { type: DataTypes.STRING, primaryKey: true },
        balance: { type: DataTypes.INTEGER, defaultValue: 0 }
    }, { timestamps: false });
};
