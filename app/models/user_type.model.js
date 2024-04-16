module.exports = (sequelize, Sequelize) => {
  const UserType = sequelize.define("user_type", {
    title: Sequelize.STRING,
    published: Sequelize.BOOLEAN
  });
  return UserType;
};