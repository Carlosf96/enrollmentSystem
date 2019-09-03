const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var studentTempSchema = new Schema({
  lastname: String,
  firstname: String,
  middlename: String,
  age: String,
  dob: String,
  lrn: String,
  yearLevel: String,
  phone: String,
  strand: String,
  address: String,
  barangay: String,
  city: String,
  lastnameGuardian: String,
  firstnameGuardian: String,
  middlenameGuardian: String,
  relationGuardian: String,
  phoneGuardian: String,
  occupationGuardian: String,
  timeIn: String,
  date: String,
  psa: String,
  gender: String,
  indigenousPeople: String,
  indigenousType: String,
  fatherLastname: String,
  fatherFirstname: String,
  fatherMiddlename: String,
  motherLastname: String,
  motherMiddlename: String,
  motherFirstname: String,
  guardianLastname: String,
  guardianMiddlename: String,
  guardianFirstname:  String,
  guardianContact: String
});


var studentTemp = mongoose.model('student_temp_db', studentTempSchema);

module.exports = studentTemp;
