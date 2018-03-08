module.exports = function (sequelize, DataTypes) {
  return sequelize.define('SiteRule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: DataTypes.TEXT,
  });
};
