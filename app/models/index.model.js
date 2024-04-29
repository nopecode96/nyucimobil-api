const dbConfig = require("../../config/db.config");
const Sequelize = require("sequelize");
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const models = path.join(__dirname, '') // correct it to path where your model files are

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  logging: false,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  useUTC: false,
  timestamps: false,
  //  ssl: true,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  dialectOptions: {
    useUTC: false,
    dateStrings: true,
    timezone: "+07:00"
  },
  timezone: "+07:00"
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//=============Table======================
//=============Table======================
//=============Table======================
db.userType = require("./user_type.model")(sequelize, Sequelize);
db.userStatus = require("./user_status.model")(sequelize, Sequelize);
db.otp = require("./otp.model")(sequelize, Sequelize);
db.mstPoint = require("./mst_point.model")(sequelize, Sequelize);
db.mstVoucher = require("./mst_voucher.model")(sequelize, Sequelize);
db.mstUnit = require("./mst_unit.model")(sequelize, Sequelize);
db.users = require("./user.model")(sequelize, Sequelize);
db.userAddress = require("./user_address.model")(sequelize, Sequelize);
db.userCar = require("./user_car.model")(sequelize, Sequelize);
db.userPoint = require("./user_point_trx.model")(sequelize, Sequelize);
db.productCategory = require("./product_category.model")(sequelize, Sequelize);
db.product = require("./product.model")(sequelize, Sequelize);
db.productGallery = require("./product_gallery.model")(sequelize, Sequelize);
db.regDistrics = require("./reg_districts.model")(sequelize, Sequelize);
db.regRegencies = require("./reg_regencies.model")(sequelize, Sequelize);
db.regProvincies = require("./reg_provinces.model")(sequelize, Sequelize);
db.transaction = require("./transaction.model")(sequelize, Sequelize);


//===============Associate================
//===============Associate================
//===============Associate================
db.regProvincies.hasMany(db.regRegencies, { foreignKey: "province_id" });
db.regRegencies.belongsTo(db.regProvincies, { foreignKey: "province_id" });
db.regRegencies.hasMany(db.regDistrics, { foreignKey: "regency_id" });
db.regDistrics.belongsTo(db.regRegencies, { foreignKey: "regency_id" });


db.userType.hasMany(db.users, { foreignKey: "fid_type" });
db.users.belongsTo(db.userType, { foreignKey: "fid_type", unique: false });
db.userStatus.hasMany(db.users, { foreignKey: "fid_status" });
db.users.belongsTo(db.userStatus, { foreignKey: "fid_status", unique: false });

db.users.hasMany(db.userAddress, { foreignKey: "uid" });
db.userAddress.belongsTo(db.users, { foreignKey: "uid", unique: false });

db.users.hasMany(db.userCar, { foreignKey: "uid" });
db.userCar.belongsTo(db.users, { foreignKey: "uid", unique: false });

db.users.hasMany(db.userPoint, { foreignKey: "uid" });
db.userPoint.belongsTo(db.users, { foreignKey: "uid", unique: false });

db.mstPoint.hasMany(db.userPoint, { foreignKey: "fid_point" });
db.userPoint.belongsTo(db.mstPoint, { foreignKey: "fid_point", unique: false });

////=============product==========
db.productCategory.hasMany(db.product, { foreignKey: "fid_category" });
db.product.belongsTo(db.productCategory, { foreignKey: "fid_category", unique: false });

db.product.hasMany(db.productGallery, { foreignKey: "fid_product" });
db.productGallery.belongsTo(db.product, { foreignKey: "fid_product", unique: false });

db.mstUnit.hasMany(db.product, { foreignKey: "fid_unit" });
db.product.belongsTo(db.mstUnit, { foreignKey: "fid_unit", unique: false });

db.users.hasMany(db.transaction, { foreignKey: "uid" });
db.transaction.belongsTo(db.users, { foreignKey: "uid", unique: false });
db.product.hasMany(db.transaction, { foreignKey: "fid_product" });
db.transaction.belongsTo(db.product, { foreignKey: "fid_product", unique: false });
db.mstVoucher.hasMany(db.transaction, { foreignKey: "fid_voucher" });
db.transaction.belongsTo(db.mstVoucher, { foreignKey: "fid_voucher", unique: false });


module.exports = db;