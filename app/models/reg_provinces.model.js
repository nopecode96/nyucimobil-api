module.exports = (sequelize, Sequelize) => {
    const regProvinces = sequelize.define("reg_provinces", {
        name: {
            type: Sequelize.STRING
        },
    });
    return regProvinces;
};
