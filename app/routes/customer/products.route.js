module.exports = app => {
    const dotenv = require('dotenv');
    dotenv.config();
    const auth = require("../../../config/auth.config.js");
    const controller = require("../../controllers/customer/products.controller.js");
    var router = require("express").Router();

    router.get("/category", auth.apiKeyValidation, auth.tokenValidation, controller.category);
    router.get("/by-cat", auth.apiKeyValidation, auth.tokenValidation, controller.productByCategory);
    router.get("/detail", auth.apiKeyValidation, auth.tokenValidation, controller.productDetail);
    app.use('/' + process.env.VERSION + '/customer/products/', router);
  };
