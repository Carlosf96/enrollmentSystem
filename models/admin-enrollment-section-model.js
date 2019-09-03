const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var enrollmentSectionSchema = new Schema({
  strand: String,
  section: String

});

var sectionAdmin = mongoose.model('section_db', enrollmentSectionSchema);

module.exports = sectionAdmin;
