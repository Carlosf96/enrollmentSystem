const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var enrollmentTracksSchema = new Schema({
  tracks: String
});

var trackAdmin = mongoose.model('track_db', enrollmentTracksSchema);

module.exports = trackAdmin;
