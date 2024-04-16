const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require("cors");
var moment = require('moment');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
dotenv.config();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
moment.locale('id');
const PORT = process.env.PORT || 5000;

const app = express();

TZ = 'Asia/Jakarta'
const corsOptions = {
  origin: '*',
  credentials: true,
  // access-control-allow-credentials:true,
  optionSuccessStatus: 200
}

app.use(logger('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});
app.options('*', cors());

const db = require("./app/models/index.model");
db.sequelize.sync()
app.locals.db = db; 
// db.sequelize.sync({ force: true })
// db.sequelize.sync({ logging: console.log })
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });
// db.users.sync(
//   { force: true, logging: console.log }
// )


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

require("./app/routes/auth.route")(app);
require("./app/routes/customer/profile.route")(app);
require("./app/routes/customer/promotion.route")(app);
require("./app/routes/customer/products.route")(app);


app.get("/" + process.env.VERSION + "/", (req, res) => {
    res.json({ message: "Welcome to NyuciMobil API " + process.env.ENVIRONMENT });
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
//   next()
// });

app.listen(PORT, () => {
  console.log("Server " + process.env.ENVIRONMENT + " is running on port " + PORT);
});

module.exports = app;
