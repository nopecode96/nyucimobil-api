module.exports = (sequelize, Sequelize) => {
    const Otp = sequelize.define('otp', {
        phone: Sequelize.STRING,
        otp: Sequelize.STRING
    }, {});
    return Otp;
};