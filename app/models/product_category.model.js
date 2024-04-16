module.exports = (sequelize, Sequelize) => {
    const ProductCategory = sequelize.define("product_category", {
      title: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      desc: {
        type: Sequelize.TEXT
      },
      other_info: {
        type: Sequelize.TEXT
      },
      published: {
        type: Sequelize.BOOLEAN
      },
    });
    return ProductCategory;
  };