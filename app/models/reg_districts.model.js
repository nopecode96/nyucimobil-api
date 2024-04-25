module.exports = (sequelize, Sequelize) => {
    const regDistricts = sequelize.define("reg_districts", {
        regency_id: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
    });
    return regDistricts;
};
