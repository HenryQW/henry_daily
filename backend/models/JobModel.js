module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Job', {
    jobId: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    hostname: DataTypes.TEXT,
    title: DataTypes.TEXT,
    company: DataTypes.TEXT,
    salary: DataTypes.TEXT,
    location: DataTypes.TEXT,
    desc: DataTypes.TEXT,
  });
};