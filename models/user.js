'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING
  }, {});
  User.associate = (models) => {
    User.belongsToMany(models.Group, { through: 'UserGroups', foreignKey: 'userId', otherKey: 'groupId' });
    User.hasMany(models.Task, { foreignKey: 'userId' });
  };
  return User;
};