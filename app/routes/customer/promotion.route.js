module.exports = app => {
    const dotenv = require('dotenv');
    dotenv.config();
    const auth = require("../../../config/auth.config.js");
    const controller = require("../../controllers/customer/promotion.controller.js");
    var router = require("express").Router();

    router.get("/", auth.apiKeyValidation, auth.tokenValidation, controller.promotion);
    router.get("/detail", auth.apiKeyValidation, auth.tokenValidation, controller.detail);
    router.get("/code", auth.apiKeyValidation, auth.tokenValidation, controller.codePromo);
    app.use('/' + process.env.VERSION + '/customer/promotions', router);
  };
