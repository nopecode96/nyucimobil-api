module.exports = app => {
    const dotenv = require('dotenv');
    dotenv.config();
    const auth = require("../../../config/auth.config.js");
    const controller = require("../../controllers/admin/orders.controller.js");
    var router = require("express").Router();

    router.get("/", auth.apiKeyValidation, auth.tokenValidation, controller.detail);

    // app.use('/' + process.env.VERSION + '/admin/orders/', router);
    app.use('/admin/orders/', router);
  };
