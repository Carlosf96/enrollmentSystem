const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var newStudentPendingSchema = new Schema({
  studentClass: String,
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
  guardianContact: String,


  section: String,
  pob: String,
  dob: String,
  tbReligion: String,
  tbCurAddress: String,
  tbPerAddress: String,
  elemName: String,
  elemDegree: String,
  elemYear: String,
  hsName: String,
  hsDegree: String,
  hsYear: String,
  othersName: String,
  othersDegree: String,
  idYear: String,
  fatherDob: String,
  motherDob: String,
  fatherAddress: String,
  motherAddress: String,
  fatherContact: String,
  motherContact: String,
  fatherOccupation: String,
  motherOccupation: String,
  fatherBusinessAdd: String,
  motherBusinessAdd: String,
  parentStatus: String,
  batch: String

});


var newStudentPending = mongoose.model('new_student_pending_db', newStudentPendingSchema);

module.exports = newStudentPending;
