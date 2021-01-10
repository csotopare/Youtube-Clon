"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

_mongoose["default"].connect(process.env.MONGO_URL_PROD, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = _mongoose["default"].connection;

var handleOpen = function handleOpen() {
  return console.log('✅ Connect to DB');
};

var handleError = function handleError(error) {
  return console.log("\u274C Error on Db Connection:".concat(error));
};

db.once('open', handleOpen);
db.on('error', handleError);