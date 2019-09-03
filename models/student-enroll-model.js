const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var studentEnrollSchema = new Schema({

lrn: String,
fullname: String,
lastname: String,
firstname: String,
middlename: String,
section: String,
strand: String,
dob: String,
phone: String,
age: String,
gender: String,
currentAddress: String,
houseNumber: String,
barangay: String,
city: String,
elemName: String,
elemDegree: String,
elemYear: String,
hsName: String,
hsDegree: String,
hsYear: String,
otherName: String,
otherDegree: String,
otherYear: String,
guardianFullname: String,
guardianFirstname: String,
guardianLastname: String,
guardianMiddlename: String,
guardianRelation: String,
guardianPhone: String,
guardianOccupation: String,
fatherFullname: String,
fatherLastname: String,
fatherFirstname: String,
fatherMiddlename: String,
fatherPhone: String,
fatherAddress: String,
fatherOccupation: String,
fatherDob: String,
motherFullname: String,

motherLastname: String,
motherFirstname: String,
motherMiddlename: String,

motherPhone: String,
motherAddress: String,
motherOccupation: String,
motherDob: String,
parentStatus: String,

hiddenPsa: String,
hiddenPob: String,
hiddenReligion: String,
hiddenPerAddress: String,
hiddenCurAddress: String,

hiddenFatherBusAddress: String,
hiddenMotherBusAddress: String,

batch: String

});


var studentEnroll = mongoose.model('dshash_student_db', studentEnrollSchema);

module.exports = studentEnroll;
