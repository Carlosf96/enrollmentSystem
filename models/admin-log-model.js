const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var logSchema = new Schema({
  fullname: String,
  date: String,
  timeIn: String,
  dateOut: String,
  timeOut: String

});

var logAdmin = mongoose.model('admin_log', logSchema);
module.exports = logAdmin;
