const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var schedTeacherAdminSchema = new Schema({
  subject: String,
  timeIn: String,
  timeOut: String,
  day: String,
  teacher: String,
  strand: String

});


var teacherAdmin = mongoose.model('schedule_teacher_db', schedTeacherAdminSchema);

module.exports = teacherAdmin;
