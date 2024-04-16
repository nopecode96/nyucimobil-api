module.exports = (sequelize, Sequelize) => {
    const ProductGallery = sequelize.define("product_gallery", {
      image: Sequelize.STRING,
      title:  Sequelize.STRING,
      desc:  Sequelize.TEXT,
      default: Sequelize.BOOLEAN,
      published: Sequelize.BOOLEAN,
    });
    return ProductGallery;
  };