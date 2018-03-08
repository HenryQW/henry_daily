module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Article', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.TEXT,
    content: DataTypes.TEXT,
    comment: DataTypes.TEXT,
  });
};
