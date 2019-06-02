module.exports = (sequelize, DataTypes) =>
    sequelize.define('Stock', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        symbol: DataTypes.TEXT,
        share: DataTypes.INTEGER,
    });
