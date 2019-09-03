const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var viewTblAdminSchema = new Schema({
  idNumber: String,
  viewStatus: String,
  userView: String,
  curriculum: String,
  addCurriculum: String

});


var tblAdmin = mongoose.model('views_tbl_db', viewTblAdminSchema);

module.exports = tblAdmin;
