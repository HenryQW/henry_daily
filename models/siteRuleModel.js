module.exports = (sequelize, DataTypes) =>
    sequelize.define('SiteRule', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.TEXT,
        hostname: DataTypes.TEXT,
        title: DataTypes.TEXT,
        content: DataTypes.TEXT,
        sanitiser: DataTypes.ARRAY(DataTypes.TEXT),
    });
