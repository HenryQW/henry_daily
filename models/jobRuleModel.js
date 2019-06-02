module.exports = (sequelize, DataTypes) =>
    sequelize.define('JobRule', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        jobId: DataTypes.INTEGER,
        name: DataTypes.TEXT,
        hostname: DataTypes.TEXT,
        title: DataTypes.TEXT,
        company: DataTypes.TEXT,
        salary: DataTypes.TEXT,
        location: DataTypes.TEXT,
        desc: DataTypes.TEXT,
    });
