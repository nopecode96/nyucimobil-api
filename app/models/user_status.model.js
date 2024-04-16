module.exports = (sequelize, Sequelize) => {
    const UserStatus = sequelize.define("user_status", {
      title: Sequelize.STRING,
      published: Sequelize.BOOLEAN
    });
    return UserStatus;
  };