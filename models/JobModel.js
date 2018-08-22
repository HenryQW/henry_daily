export default function (sequelize, DataTypes) {
  return sequelize.define('Job', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    jobId: DataTypes.TEXT,
    hostname: DataTypes.TEXT,
    url: DataTypes.TEXT,
    title: DataTypes.TEXT,
    company: DataTypes.TEXT,
    salary: DataTypes.TEXT,
    location: DataTypes.TEXT,
    desc: DataTypes.TEXT,
  });
}
