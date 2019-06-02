module.exports = (sequelize, DataTypes) =>
    sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        apiKey: DataTypes.TEXT,
    });
