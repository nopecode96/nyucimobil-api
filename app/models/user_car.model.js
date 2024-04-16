module.exports = (sequelize, Sequelize) => {
    const UserCar = sequelize.define('user_car', {
        category: Sequelize.STRING, /// Mobil, Motor
        model: Sequelize.STRING, /// Mobil, Motor
        brand: Sequelize.STRING,
        type: Sequelize.STRING, /// Small, Medium, Large
        plat_no: Sequelize.STRING
    });
    return UserCar;
};