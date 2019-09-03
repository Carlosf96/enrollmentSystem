const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var enrollmentStrandsSchema = new Schema({
  tracks: String,
  strands: String

});

var strandAdmin = mongoose.model('strand_db', enrollmentStrandsSchema);

module.exports = strandAdmin;
