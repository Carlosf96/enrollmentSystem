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
const tblAdmin = require('../models/admin-tbl-view-model.js');
const enrollmentSettings = require('../models/admin-enrollment-settings-model.js');
const pendingNewStudent = require('../models/new-student-pending-model.js');
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
  console.log('administrator-controller is now connected to database');
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

  //LOGIN AND SAVING USER LOGS
  app.post('/login',(req,res)=>{
    var dt = dateTime.create();
    var date = dt.format('Y-m-d');
    var time = dt.format('H:M:S');
    //idNumber: req.body.username, password: req.body.password
    userAdmin.findOne({idNumber: req.body.username, password: req.body.password},(err, user)=>{
      if (!user){
       console.log("User not found");
     }else{

        req.session.username = req.body.username;
        req.session.password = req.body.password;
        req.session.timeIn = time;
        req.session.date = date;
        res.redirect('/admin');
        res.end('done');


        new logAdmin({
          fullname: req.body.username,
          date: date,
          timeIn: time,
          dateOut: "Active",
          timeOut: "Active"

        }).save((err)=>{
          if(err) throw err;
        });

        tblAdmin.find({idNumber: req.session.username}, (err, user2)=>{
          if(user2.length===0){
            new tblAdmin({
              idNumber: req.session.username,
              viewStatus: "all",
              userView: "list",
              curriculum: 'new',
              addCurriculum: 'new'
            }).save((err)=>{
              if (err) throw err;
            });
          }
        })
      }
    })
});


  //SAVE USER/ADMIN DATA
  app.post('/save-user-data', (req, res)=>{

    userAdmin.findOne({idNumber: req.body.idNumber},(err, user)=>{

      if(!user){
        new userAdmin({
          idNumber: req.body.idNumber,
          lastname: req.body.lastname,
          middlename: req.body.middlename,
          firstname: req.body.firstname,
          userType: req.body.userType,
          phoneNumber: req.body.phoneNumber,
          gender: req.body.gender,
          password: req.body.password,
          teachingStatus: req.body.teachingStatus
        }).save((err)=>{
          if(err) throw err;
        });
        req.session.idNumber =  req.body.idNumber;
        res.end("done");
      }
    });
  });


  //LOGGING OUT
  app.post('/logging-out',(req, res)=>{

    var dt = dateTime.create();
    var date = dt.format('Y-m-d');
    var time = dt.format('H:M:S');

    console.log(req.session.username);
    console.log(req.session.timeIn);
    console.log(req.session.date);

    logAdmin.updateOne({
      fullname: req.session.username,
      timeIn: req.session.timeIn,
      date: req.session.date
    }, {
      dateOut: date,
      timeOut:time
    }, (err)=>{
      console.log("data updated");
      res.redirect("../logout");
    });
  });





  // CLEAR USER LOGS
  app.post('/deleteLogs', (req, res)=>{
    logAdmin.deleteMany({}, function(err){
      console.log("Successfully Deleted");
      logAdmin({
        fullname: req.session.username,
        timeIn: req.session.timeIn,
        date: req.session.date,
        dateOut: "Active",
        timeOut:"Active"
      }).save();
    });
  });

  module.exports
  //saving subjects
  app.post('/save-subject-data', (req, res)=>{

    subjectAdmin.find({courseTitle: req.body.courseTitle}, (err, user)=>{
      if(user.length===0){
        new subjectAdmin({
          courseTitle: req.body.courseTitle,
          preRequisite: req.body.preRequisite,
          typeOfCurriculum: req.body.typeOfCurriculum
        }).save((err)=>{
          if (err) throw err;
          console.log('Data Saved Successfully');
        });
        res.end('done');
      }else{
        console.log("subject existed");
      }
    });


  });



  app.post('/update-subject-data', (req, res)=>{

    subjectAdmin.find({courseTitle: req.body.courseTitle}, (err, user)=>{

      subjectAdmin.updateOne({courseTitle: req.body.idHolder}, {$set:{
        courseTitle: req.body.courseTitle,
        preRequisite: req.body.preRequisite,
        typeOfCurriculum: req.body.typeOfCurriculum
      }}, (err)=>{
        if (err) throw err;
      });
   });
});



app.post('/save-schedule', (req, res)=>{
    schedAdmin({
      subject: req.body.subject,
      timeIn: req.body.timeIn,
      timeOut: req.body.timeOut,
      day: req.body.day,
      strand: req.body.strand
    }).save((err)=>{
      if (err) throw err;
      console.log('Data Saved Successfully');
    });

    if(req.body.teacher === "" || req.body.teacher === null || req.body.teacher === undefined){
      console.log("teacher sched not save");
    }else{
      teacherAdmin({
        subject: req.body.subject,
        timeIn: req.body.timeIn,
        timeOut: req.body.timeOut,
        day: req.body.day,
        teacher: req.body.teacher,
        strand: req.body.strand
      }).save((err)=>{
        if (err) throw err;
      });
    }
    res.end('done');
});



app.post('/save-tracks', (req, res)=>{
  var trackHolder = req.body.tracks;
  trackAdmin.find({tracks: trackHolder.toLowerCase()}, (err, user)=>{

    if(user.length === 0){

      new trackAdmin({
        tracks:req.body.tracks
        }).save((err)=>{
          console.log("Track Saved");
        });

    }else{
      console.log("Data Already Existed");
    }
  });
});




app.post('/save-strands', (req, res)=>{
  var strandHolder = req.body.strands;

  strandAdmin.find({strands: strandHolder.toLowerCase()}, (err, user)=>{

    if(user.length === 0){

      new strandAdmin({
        tracks:req.body.tracks,
        strands:req.body.strands
        }).save((err)=>{
          console.log("Strand Saved");
        });

    }else{
      console.log("Strand Already Existed");
    }
  });
});




app.post('/save-section', (req, res)=>{
  var sectionHolder = req.body.section;
  var strandHolder = req.body.strand;

  sectionAdmin.find({section: sectionHolder.toLowerCase(), strand: strandHolder.toLowerCase()}, (err, user)=>{
    if (user.length===0){
      new sectionAdmin({
        strand: req.body.strand,
        section: req.body.section
      }).save((err)=>{
        console.log("Section Successfully Saved");

      });
    }else{
      console.log("Strand and Section already exist");
    }
  })
});



app.post('/delete-whole-sched', (req, res)=>{
  console.log(req.body.delSched);

  schedAdmin.deleteMany({strand: req.body.delSched},(err)=>{
    if (err) throw err;
    console.log("Schedule deleted Successfully");
  });


  teacherAdmin.deleteMany({strand: req.body.delSched}, (err)=>{
    if (err) throw err;
    console.log(req.body.delSched);
  })
});

app.post('/change-table-view',(req, res)=>{
  tblAdmin.updateOne({idNumber: req.session.username}, {$set:{
    viewStatus: req.body.views
  }}, (err)=>{
    if (err) throw err;
  });
});

app.post('/change-view-user',(req, res)=>{
  tblAdmin.updateOne({idNumber: req.session.username}, {$set:{
    userView: req.body.userView
  }}, (err)=>{
    if (err) throw err;
    console.log("data updated");
  });
});

app.post('/curriculum-type',(req, res)=>{
  tblAdmin.updateOne({idNumber: req.session.username}, {$set:{
    curriculum: req.body.curriculum
  }}, (err)=>{
    if (err) throw err;
    console.log("data updated");
  });
});

app.post('/curriculum-add-subjects',(req, res)=>{
  tblAdmin.updateOne({idNumber: req.session.username}, {$set:{
    addCurriculum: req.body.addCurriculum
  }}, (err)=>{
    if (err) throw err;
    console.log("data updated");
  });
});

app.post('/edit-password-settings',(req, res)=>{
  userAdmin.find({idNumber: req.session.username, password: req.body.oldPassword},(err, user)=>{
    if(user.length===1){
      userAdmin.updateOne({idNumber: req.session.username}, {$set:{
        password: req.body.newPassword
      }}, (err)=>{
        if (err) throw err;
        console.log("data updated");
      });
    }else{
      console.log("You entered a wrong Password");
    }
  })
});



app.post('/save-enrollment-settings', (req, res)=>{
  enrollmentSettings.updateOne({_id:'5d5eac152b3cd10e8c764ef0'},{$set:{
    maxStudent: req.body.maxStudent,
    enrollmentStatus: req.body.enrollmentStatus,
    academicFirst: req.body.academicFirst,
    academicEnds: req.body.academicEnds,
    semester: req.body.semester
  }},(err)=>{
    console.log("Data Updated")
  })
});


app.post('/enroll-student-success', (req, res)=>{

  new enrollStudent({
    lrn: req.body.lrn,
    fullname: req.body.fullname,
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    middlename: req.body.middlename,
    section: req.body.section,
    strand: req.body.strand,
    dob: req.body.dob,
    phone: req.body.phone,
    age: req.body.age,
    gender: req.body.gender,
    currentAddress: req.body.currentAddress,
    houseNumber: req.body.houseNumber,
    barangay: req.body.barangay,
    city: req.body.city,
    elementaryTr: req.body.elementaryTr,
    elemName: req.body.elemName,
    elemDegree: req.body.elemDegree,
    elemYear: req.body.elemYear,
    hsName: req.body.hsName,
    hsDegree: req.body.hsDegree,
    hsYear: req.body.hsYear,
    otherName: req.body.otherName,
    otherDegree: req.body.otherDegree,
    otherYear: req.body.otherYear,
    guardianFullname: req.body.guardianFullname,
    guardianLastname: req.body.gLastname,
    guardianFirstname: req.body.gFirstname,
    guardianMiddlename: req.body.gMiddlename,
    guardianRelation: req.body.guardianRelation,
    guardianPhone: req.body.guardianPhone,
    guardianOccupation: req.body.guardianOccupation,
    fatherFullname: req.body.fatherFullname,
    fatherLastname: req.body.fLastname,
    fatherFirstname: req.body.fFirstname,
    fatherMiddlename: req.body.fMiddlename,
    fatherPhone: req.body.fatherPhone,
    fatherAddress: req.body.fatherAddress,
    fatherOccupation: req.body.fatherOccupation,
    fatherDob: req.body.fatherDob,
    motherFullname: req.body.motherFullname,
    motherLastname: req.body.mLastname,
    motherFirstname: req.body.mFirstname,
    motherMiddlename: req.body.mMiddlename,
    motherPhone: req.body.motherPhone,
    motherAddress: req.body.motherAddress,
    motherOccupation: req.body.motherOccupation,
    motherDob: req.body.motherDob,
    parentStatus: req.body.parentStatus,
    hiddenPsa: req.body.hiddenPsa,
    hiddenPob: req.body.hiddenPob,
    hiddenReligion: req.body.hiddenReligion,
    hiddenPerAddress: req.body.hiddenPerAddress,
    hiddenCurAddress: req.body.hiddenCurAddress,
    hiddenFatherBusAddress: req.body.hiddenFatherBusAddress,
    hiddenMotherBusAddress: req.body.hiddenMotherBusAddress,
    batch: req.body.batch
  }).save((err)=>{
    if (err) throw err;
    pendingNewStudent.deleteOne({_id: req.session.studentObjectId}, (err)=>
    {
      if(err)throw err;
    });
  });
});

}
