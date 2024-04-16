module.exports = app => {
    const dotenv = require('dotenv');
    dotenv.config();
    const auth = require("../../../config/auth.config.js");
    const controller = require("../../controllers/customer/profile.controller.js");
    var router = require("express").Router();

    var multer  = require('multer');
    var router = require("express").Router();
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, process.env.MNT_PATH + 'users')
      },
      filename: function (req, file, cb) {
        fileExtension = file.originalname.split('.')[1]
        cb(null, Date.now() + '.' + fileExtension)
      }
    })
    var upload = multer({ storage: storage })


    router.get("/profile", auth.apiKeyValidation, auth.tokenValidation, controller.profileDetail);
    router.put("/profile", auth.apiKeyValidation, auth.tokenValidation, controller.profileUpdate);
    router.put("/photo", auth.apiKeyValidation, auth.tokenValidation, upload.single('photo'), controller.photoUpdate);
    router.get("/address", auth.apiKeyValidation, auth.tokenValidation, controller.addresses);
    router.post("/address", auth.apiKeyValidation, auth.tokenValidation, controller.addressSave);
    router.put("/address", auth.apiKeyValidation, auth.tokenValidation, controller.addressUpdate);
    router.delete("/address", auth.apiKeyValidation, auth.tokenValidation, controller.addressDelete);
    router.get("/car", auth.apiKeyValidation, auth.tokenValidation, controller.cars);
    router.post("/car", auth.apiKeyValidation, auth.tokenValidation, controller.carSave);
    router.put("/car", auth.apiKeyValidation, auth.tokenValidation, controller.carUpdate);
    router.delete("/car", auth.apiKeyValidation, auth.tokenValidation, controller.carDelete);
    app.use('/' + process.env.VERSION + '/customer', router);
  };
