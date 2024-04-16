module.exports = (sequelize, Sequelize) => {
    const UserAddess = sequelize.define('user_address', {
        title: Sequelize.STRING,
        lat: Sequelize.STRING,
        lng: Sequelize.STRING,
        address: Sequelize.STRING,
        distric: Sequelize.STRING,
        city: Sequelize.STRING,
        province: Sequelize.STRING,
        default: Sequelize.BOOLEAN
    });
    return UserAddess;
};