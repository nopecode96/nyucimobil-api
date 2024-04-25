module.exports = (sequelize, Sequelize) => {
    const regRegencies = sequelize.define("reg_regencies", {
        province_id: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
    });
    return regRegencies;
  };
