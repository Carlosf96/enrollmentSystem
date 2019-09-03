const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var subjectSchema = new Schema({
  courseTitle: String,
  preRequisite: String,
  typeOfCurriculum: String
});

var subjectAdmin = mongoose.model('subjects', subjectSchema);

module.exports = subjectAdmin;
