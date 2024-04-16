module.exports = (sequelize, Sequelize) => {
    const MstUnit = sequelize.define("mst_unit", {
      title: {
        type: Sequelize.STRING
      },
      published: {
        type: Sequelize.BOOLEAN
      },
    });
    return MstUnit;
  };