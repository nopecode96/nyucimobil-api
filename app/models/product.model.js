module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
      fid_category:  Sequelize.INTEGER,
      title:  Sequelize.STRING,
      thumbnail: Sequelize.STRING,
      desc: Sequelize.TEXT,
      other_info: Sequelize.TEXT,
      fid_unit: Sequelize.INTEGER,
      stock: Sequelize.DOUBLE,
      price: Sequelize.DOUBLE,
      published: Sequelize.BOOLEAN,
    });
    return Product;
  };