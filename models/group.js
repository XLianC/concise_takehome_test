'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Group.associate = (models) => {
    Group.belongsToMany(models.User, { through: 'UserGroups', foreignKey: 'groupId', otherKey: 'userId' });
  };
  return Group;
};