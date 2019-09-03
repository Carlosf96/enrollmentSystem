const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var userAdminSchema = new Schema({
  idNumber: String,
  lastname: String,
  middlename: String,
  firstname: String,
  userType: String,
  phoneNumber: String,
  gender: String,
  password: String,
  confirmPassword: String,
  teachingStatus: String
});


var userAdmin = mongoose.model('administrator_db', userAdminSchema);

module.exports = userAdmin;
