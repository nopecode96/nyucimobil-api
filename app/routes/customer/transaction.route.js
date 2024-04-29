module.exports = app => {
    const dotenv = require('dotenv');
    dotenv.config();
    const auth = require("../../../config/auth.config.js");
    const controller = require("../../controllers/customer/transaction.controller.js");
    var router = require("express").Router();

    router.get("/", auth.apiKeyValidation, auth.tokenValidation, controller.getAll);
    router.get("/detail", auth.apiKeyValidation, auth.tokenValidation, controller.getDetail);
    router.post("/", auth.apiKeyValidation, auth.tokenValidation, controller.submitTransaction);
    // router.get("/code", auth.apiKeyValidation, auth.tokenValidation, controller.codePromo);
    app.use('/' + process.env.VERSION + '/customer/transaction', router);
  };
