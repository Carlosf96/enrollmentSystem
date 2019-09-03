const studentRoute = require('../routes/student-route.js');
const session = require('cookie-session');
const keys = require('../config/keys');
const request = require('request');
const crypto = require('crypto');
const userAdmin = require('../models/admin-user-model.js');
const logAdmin = require('../models/admin-log-model.js');
const subjectAdmin = require('../models/admin-subject-model.js');
const schedAdmin = require('../models/admin-schedule-model.js');
const teacherAdmin = require('../models/admin-teacher-schedule-model.js');
const trackAdmin = require('../models/admin-enrollment-tracks-model.js');
const strandAdmin = require('../models/admin-enrollment-strands-model.js');
const sectionAdmin = require('../models/admin-enrollment-section-model.js');
const tempStudent = require('../models/student-temp-model.js');
const tempNewStudent = require('../models/student-temp-new-model.js');
const pendingNewStudent = require('../models/new-student-pending-model.js');
const tblAdmin = require('../models/admin-tbl-view-model.js');
const enrollStudent = require('../models/student-enroll-model.js');
const passport = require('passport');
const mongoose = require('mongoose');
var dateTime = require('node-datetime');
var Promise = require('promise');
var captcha = "";

module.exports = captcha;
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
mongoose.connect(process.env.MONGO_URI || keys.mongodb.url,{useNewUrlParser:true},(err)=>{
  if(err) throw err;
  console.log('student-controller is now connected to database');
});

module.exports = function(app){
  app.use(session({
    secret: keys.sessionKey.secretKey,
    resave: true,
    saveUninitialized: true
  }));
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));

  app.post('/destroy-session', (req, res)=>{
    var time2 = req.session.studentTime;
    var date2 = req.session.studentDate;
    var dobStudent2 = req.session.dob;

    tempStudent.findOne({dob: req.session.dob, timeIn:req.session.studentTime, date:req.session.studentDate}, (err, user)=>{
      tempNewStudent.findOne({dob: req.session.dob, timeIn:req.session.studentTime, date:req.session.studentDate}, (err, user2)=>{
        new pendingNewStudent({
          lastname: user.lastname,
          firstname: user.firstname,
          middlename: user.middlename,
          age: user.age,
          dob: user.dob,
          lrn: user.lrn,
          yearLevel: user.yearLevel,
          phone: user.phone,
          strand: user.strand,
          address: user.address,
          barangay: user.barangay,
          city: user.city,
          lastnameGuardian: user.lastnameGuardian,
          firstnameGuardian: user.firstnameGuardian,
          middlenameGuardian: user.middlenameGuardian,
          relationGuardian: user.relationGuardian,
          phoneGuardian: user.phoneGuardian,
          occupationGuardian: user.occupationGuardian,
          timeIn: user.timeIn,
          date: user.date,
          psa: user.psa,
          gender: user.gender,
          indigenousPeople: user.indigenousPeople,
          indigenousType: user.indigenousType,
          fatherLastname: user.fatherLastname,
          fatherFirstname: user.fatherFirstname,
          fatherMiddlename: user.fatherMiddlename,
          motherLastname: user.motherLastname,
          motherMiddlename: user.motherMiddlename,
          motherFirstname: user.motherFirstname,
          guardianLastname: user.guardianLastname,
          guardianMiddlename: user.guardianMiddlename,
          guardianFirstname:  user.guardianFirstname,
          guardianContact: user.guardianContact,


          section: user2.section,
          pob: user2.pob,
          tbReligion: user2.tbReligion,
          tbCurAddress: user2.tbCurAddress,
          tbPerAddress: user2.tbPerAddress,
          elemName: user2.elemName,
          elemDegree: user2.elemDegree,
          elemYear: user2.elemYear,
          hsName: user2.hsName,
          hsDegree: user2.hsDegree,
          hsYear: user2.hsYear,
          othersName: user2.othersName,
          othersDegree: user2.othersDegree,
          idYear: user2.idYear,
          fatherDob: user2.fatherDob,
          motherDob: user2.motherDob,
          fatherAddress: user2.fatherAddress,
          motherAddress: user2.motherAddress,
          fatherContact: user2.fatherContact,
          motherContact: user2.motherContact,
          fatherOccupation: user2.fatherOccupation,
          motherOccupation: user2.motherOccupation,
          fatherBusinessAdd: user2.fatherBusinessAdd,
          motherBusinessAdd: user2.motherBusinessAdd,
          parentStatus: user2.parentStatus,
          timeIn: time2,
          date: date2,
          batch: req.body.batch
        }).save((err)=>{
          console.log("session destroy");
          req.session.destroy();

          tempStudent.deleteOne({dob: dobStudent2 , timeIn: time2, date: date2}, (err)=>{
            console.log('temp Student deleted');
          });

          tempNewStudent.deleteOne({dob: dobStudent2 , timeIn: time2, date: date2}, (err)=>{
            console.log('temp New Student deleted');
          });
        });
      });
    });
  });



  app.post('/subscribe', (req, res) => {

    req.session.studentClassification = req.body.studentClass;
    req.session.oldStudent = req.body.oldStudent;

    console.log(req.session.oldStudent);

    if(
      req.body.captcha === undefined ||
      req.body.captcha === '' ||
      req.body.captcha === null
    ){
      return res.json({"success": false, "msg":"Please select captcha"});
    }

    const secretKey = '6LewQrMUAAAAABVvfx5kf9KHwLJnu-nftZk4xbjc';

    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    request(verifyUrl, (err, response, body) => {
      body = JSON.parse(body);

      req.session.success = body.success;

      if(body.success !== undefined && !body.success){
        return res.json({"success": false, "msg":"Failed captcha verification"});
      }

      return res.json({"success": true, "msg":"Captcha passed"});
      req.session.okCaptcha = "true";
    });
  });


  //OLD STUDENT FORM 2
  app.post('/verify',(req,res)=>{


    var dt = dateTime.create();
    var date = dt.format('Y-m-d');
    var time = dt.format('H:M:S');

    req.session.studentTime = time;
    req.session.studentDate = date;
    req.session.dob = req.body.dob;
    req.session.strand = req.body.strand;


    tempStudent({
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      middlename: req.body.middlename,
      age: req.body.age,
      dob: req.body.dob,
      lrn: req.body.lrn,
      yearLevel: req.body.yearLevel,
      phone: req.body.phone,
      strand: req.body.strand,
      address: req.body.address,
      barangay: req.body.barangay,
      city: req.body.city,
      lastnameGuardian: req.body.lastnameGuardian,
      firstnameGuardian: req.body.firstnameGuardian,
      middlenameGuardian: req.body.middlenameGuardian,
      relationGuardian: req.body.relationGuardian,
      phoneGuardian: req.body.phoneGuardian,
      occupationGuardian: req.body.occupationGuardian,
      timeIn: time,
      date: date,
      psa: "",
      gender: "",
      indigenousPeople: "",
      indigenousType: "",
      fatherLastname: "",
      fatherFirstname: "",
      fatherMiddlename: "",
      motherLastname: "",
      motherMiddlename: "",
      motherFirstname: ""

    }).save((err)=>{
      if (err) throw err;
      var dobStudent = req.body.dob;
      console.log("data saved");
    });

    res.end('done');
  });


  //NEW STUDENT FORM 3
  app.post('/verifyForm3',(req,res)=>{
    req.session.psa = req.body.psa;
    req.session.fatherFullname = req.body.fatherFirstname + " "  + req.body.fatherMiddlename.charAt(0) + ". " + req.body.fatherLastname;
    req.session.motherFullname = req.body.motherFirstname + " "  + req.body.motherMiddlename.charAt(0) + ". " + req.body.motherLastname;
    console.log(req.session.fatherFullname);
    tempStudent.find({dob: req.session.dob , timeIn: req.session.studentTime , date: req.session.studentDate}, (err, user)=>{
      if (user.length === 1){
        tempStudent.updateOne({dob: req.session.dob , timeIn: req.session.studentTime , date: req.session.studentDate},
        {$set:{
          psa: req.body.psa,
          gender: req.body.gender,
          indigenousPeople: req.body.indigenousPeople,
          indigenousType: req.body.indigenousType,
          fatherLastname: req.body.fatherLastname,
          fatherFirstname: req.body.fatherFirstname,
          fatherMiddlename: req.body.fatherMiddlename,
          motherLastname: req.body.motherLastname,
          motherMiddlename: req.body.motherMiddlename,
          motherFirstname: req.body.motherFirstname
        }}, (err)=>{
          console.log("Data Updated in form 2 student");
        });
      }

      req.session.psa = req.body.psa;
    })
  });


  //NEW STUDENT FORM 4
  app.post('/verifyForm4',(req,res)=>{

    myDob = req.session.dob;
    myTime = req.session.studentTime;
    myDate = req.session.studentDate;
    req.session.pob = req.body.pob;
    res.end('done');

    tempNewStudent({
      section: req.body.section,
      pob: req.body.pob,
      dob: req.session.dob,
      tbReligion: req.body.tbReligion,
      tbCurAddress: req.body.tbCurAddress,
      tbPerAddress: req.body.tbPerAddress,
      elemName: req.body.elemName,
      elemDegree: req.body.elemDegree,
      elemYear: req.body.elemYear,
      hsName: req.body.hsName,
      hsDegree: req.body.hsDegree,
      hsYear: req.body.hsYear,
      othersName: req.body.othersName,
      othersDegree: req.body.othersDegree,
      idYear: req.body.idYear,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName,
      fatherDob: req.body.fatherDob,
      motherDob: req.body.motherDob,
      fatherAddress: req.body.fatherAddress,
      motherAddress: req.body.motherAddress,
      fatherContact: req.body.fatherContact,
      motherContact: req.body.motherContact,
      fatherOccupation: req.body.fatherOccupation,
      motherOccupation: req.body.motherOccupation,
      fatherBusinessAdd: req.body.fatherBusinessAdd,
      motherBusinessAdd: req.body.motherBusinessAdd,
      parentStatus: req.body.parentStatus,
      timeIn: req.session.studentTime,
      date: req.session.studentDate
    }).save((err)=>{
      if (err) throw err;
      console.log("new student data saved successfully");
      
    });
  });

  app.post('/old-student-authentication', (req, res)=>{
    enrollStudent.find({lrn: req.body.lrn, fullname: req.body.fullname, dob: req.body.dob}, (err, user)=>{
      if(user.length === 1){
        req.session.generateLrn = req.body.lrn;
        req.session.studentClassification = 'old student';
        req.session.oldStudent = 'newRecord';
        req.session.generateData = true;
        res.redirect('/student/first-form-enrollment');
      }else{
        console.log('user not found');
      }
    })
  });
}
