module.exports = app => {
    const dotenv = require('dotenv');
    dotenv.config();
    const auth = require("../../config/auth.config.js");
    const controller = require("../controllers/auth.controller.js");
    var router = require("express").Router();

    router.post("/login", auth.apiKeyValidation, controller.loginAccess);
    router.post("/login-otp", auth.apiKeyValidation, controller.loginOTP);
    router.post("/login-otp-verify", auth.apiKeyValidation, controller.loginOtpVerify);
    router.post("/register", auth.apiKeyValidation, controller.register);
    app.use('/' + process.env.VERSION + '/auth', router);
  };
