const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var schedAdminSchema = new Schema({
  subject: String,
  timeIn: String,
  timeOut: String,
  day: String,
  strand: String

});


var schedAdmin = mongoose.model('schedule_db', schedAdminSchema);

module.exports = schedAdmin;
