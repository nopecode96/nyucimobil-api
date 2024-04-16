module.exports = (sequelize, Sequelize) => {
    const MstVoucher = sequelize.define("mst_voucher", {
      image: Sequelize.STRING,
      title: Sequelize.STRING,
      desc: Sequelize.TEXT,
      code: Sequelize.STRING,
      discount: Sequelize.DOUBLE,
      start_date: Sequelize.DATE,
      end_date: Sequelize.DATE,
      usage: Sequelize.INTEGER,
      published: Sequelize.BOOLEAN,
    });
    return MstVoucher;
  };