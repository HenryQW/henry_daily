module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Stock', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        symbol: DataTypes.TEXT,
        share: DataTypes.INTEGER
    });
};
