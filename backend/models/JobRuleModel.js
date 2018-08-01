module.exports = function (sequelize, DataTypes) {
  return sequelize.define('JobRule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hostname: DataTypes.TEXT,
    title: DataTypes.TEXT,
    company: DataTypes.TEXT,
    salary: DataTypes.TEXT,
    location: DataTypes.TEXT,
    desc: DataTypes.TEXT,
  });
};
