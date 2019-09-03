const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var newStudentTempSchema = new Schema({
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
  fatherName: String,
  motherName: String,
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
  timeIn: String,
  date: String
});


var newStudentTemp = mongoose.model('student_temp_new_db', newStudentTempSchema);

module.exports = newStudentTemp;
