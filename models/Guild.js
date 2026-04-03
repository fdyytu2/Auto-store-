module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Guild', {
        guild_id: { type: DataTypes.STRING, primaryKey: true },
        prefix: { type: DataTypes.STRING, defaultValue: '!' },
        tier: { type: DataTypes.STRING, defaultValue: 'basic' }
    }, { timestamps: false });
};
