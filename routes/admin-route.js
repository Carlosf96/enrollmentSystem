const router = require('express').Router();
const userAdmin = require('../models/admin-user-model');
const logAdmin = require('../models/admin-log-model.js');
const subjectAdmin = require('../models/admin-subject-model.js');
const schedAdmin = require('../models/admin-schedule-model.js');
const tracksAdmin = require('../models/admin-enrollment-tracks-model.js');
const strandsAdmin = require('../models/admin-enrollment-strands-model.js');
const sectionAdmin = require('../models/admin-enrollment-section-model.js');
const tblAdmin = require('../models/admin-tbl-view-model.js');
const teacherAdmin = require('../models/admin-teacher-schedule-model.js');
const studentPending = require('../models/new-student-pending-model.js');
const enrollStudent = require('../models/student-enroll-model.js');
const keys = require('../config/keys');
const enrollmentSettings = require('../models/admin-enrollment-settings-model.js');

var hold = "";

var option = "";


router.get('/admin',(req, res)=>{
  if (req.session.username && req.session.password){
    studentPending.find({}, (err, user)=>{
      hold="admin";
      console.log(user.length);
      res.render('admin/admin',{hold: hold, student: user});
    });

  }else{
    res.redirect('login-form')
  }
});


router.get('/students',(req, res)=>{

  if (req.session.username && req.session.password){
    enrollStudent.find({}, (err, user)=>{
      hold="students";
      res.render('admin/admin',{hold: hold, student: user});
    });

  }else{
    res.redirect('login-form')
  }

});

router.get('/teachers',(req, res)=>{
  if (req.session.username && req.session.password){
    userAdmin.find({teachingStatus: 'teaching'}, (err, user)=>{
      teacherAdmin.find({},(err, user2)=>{
        hold="teachers";
        res.render('admin/admin',{hold: hold, teacher: user, user2: user2});
      }).sort({day:1, timeIn:1})

    })
  }else{
    res.redirect('login-form')
  }
});

router.get('/enrolment',(req, res)=>{
  if (req.session.username && req.session.password){
    tracksAdmin.find({},(err, user)=>{
      strandsAdmin.find({},(err, user2)=>{
        sectionAdmin.find({},(err, user3)=>{
          tblAdmin.find({idNumber: req.session.username},(err, user4)=>{
            hold="enrolment";
            res.render('admin/admin',{hold: hold, tracks: user, strands: user2, section: user3, viewStatus: user4});
          });
        }).sort({strands:1});
      })
    });
  }else{
    res.redirect('login-form')
  }
});

router.get('/subjects',(req, res)=>{
  if (req.session.username && req.session.password){
    subjectAdmin.find({typeOfCurriculum: 'new'},(err, user)=>{
      tblAdmin.find({idNumber: req.session.username},(err, user2)=>{
        subjectAdmin.find({typeOfCurriculum: 'old'},(err, user3)=>{

          hold="subjects";
          res.render('admin/admin',{hold: hold, user:user, curriculum:user2, user3: user3});
        });
      });
    }).sort({courseTitle:1});
  }else{
    res.redirect('/administrator/login-form')
  }
});

router.get('/schedules',(req, res)=>{
  var strandNum;

  if (req.session.username && req.session.password){

  schedAdmin.distinct('strand' ,(err, user)=>{
      strandNum = user.length;
        schedAdmin.find({strand: user},(err, user2)=>{
          hold="schedules";
          res.render('admin/admin',{hold: hold, strand: user, user: user2});
      }).sort({day:1, timeIn:1});
    });

  }else{
    res.redirect('login-form')
  }
});


router.get('/users',(req, res)=>{
  if (req.session.username && req.session.password){
    userAdmin.find({},(err, user)=>{
      tblAdmin.find({idNumber: req.session.username},(err, user2)=>{
        hold="users";
        res.render('admin/admin',{hold: hold, user: user, viewStatus: user2});
      });
    }).sort({firstname:1});

      }else

      {
        res.redirect('login-form')
      }

});

router.get('/settings',(req, res)=>{
  if (req.session.username && req.session.password){
    userAdmin.find({idNumber: req.session.username}, (err, user)=>{
      hold="settings";
      option="settings-security";
      res.render('admin/admin',{hold: hold, user: user, option: option});
    });
  }else{
    res.redirect('login-form')
  }
});

router.get('/reports',(req, res)=>{
  if (req.session.username && req.session.password){
    hold="reports";
    res.render('admin/admin',{hold: hold});
  }else{
    res.redirect('login-form')
  }
});

router.get('/logs',(req, res)=>{
  if (req.session.username && req.session.password){
    logAdmin.find({}, (err, user)=>{
      hold="logs";
      res.render('admin/admin',{hold: hold, user: user});
    }).sort({date:-1,timeIn:-1});
  }else{
    res.redirect('login-form')
  }
});


router.get('/login-form',(req, res)=>{

  if (req.session.username && req.session.password){
    logAdmin.find({}, (err, user)=>{
      hold="admin";
      res.redirect('/administrator/admin');
    })
  }else{
    res.render('admin/login-form',{myKey: keys.security.siteKey});
  }

});

//Sub Routers ---->



router.get('/users/add-new-user',(req, res)=>{
  if (req.session.username && req.session.password){
    hold="user-add-new-user";
    res.render('admin/admin',{hold: hold});
  }else{
    res.redirect('../login-form')
  }
});



router.get('/users/:user',(req, res)=>{

  userAdmin.deleteOne({idNumber: req.params.user},(err)=>{
    if (err) throw err;
    res.redirect('/administrator/users');
  });


  teacherAdmin.deleteOne({idNumber: req.params.user}, (err)=>{
    if (err) throw err;
  });
});


router.get('/subject/:user',(req, res)=>{
  if (req.session.username && req.session.password){
    subjectAdmin.find({},(err, user)=>{
      subjectAdmin.deleteMany({courseTitle: req.params.user},(err)=>{
        if (err) throw err;
        res.redirect('/administrator/subjects');
      });

      teacherAdmin.deleteMany({subject: req.params.user}, (err)=>{
        if (err) throw err;
      });

      schedAdmin.deleteMany({subject: req.params.user}, (err)=>{
        if (err) throw err;
      });


    })
  }else{
    res.redirect('/administrator/login-form')
  }
});


router.get('/subjects/edit-subject/:courseTitle',(req, res)=>{
  hold= "user-edit-subject";
  if (req.session.username && req.session.password){
    subjectAdmin.find({},(err, user)=>{
      subjectAdmin.find({courseTitle: req.params.courseTitle},(err, user2)=>{
        res.render('admin/admin', {hold: hold, user:user, user2: user2, courseTitle: req.params.courseTitle});
      });
    });
  }else{
    res.redirect('/administrator/login-form')
  }
});



router.get('/subjects/add-subject',(req, res)=>{
  if (req.session.username && req.session.password){
    subjectAdmin.find({typeOfCurriculum: 'new'},(err, user)=>{
      tblAdmin.find({idNumber: req.session.username},(err, user2)=>{
        subjectAdmin.find({typeOfCurriculum: 'old'},(err, user3)=>{
          hold="user-add-subject";
          res.render('admin/admin',{hold: hold, user:user, addCurriculum: user2, user3: user3});
        });
      })
    })
  }else{
    res.redirect('/administrator/login-form')
  }
});


router.get('/schedules/admin-add-schedules',(req, res)=>{
  if (req.session.username && req.session.password){
    subjectAdmin.find({}, (err, user)=>{
      sectionAdmin.find({},(err,user2)=>{
        userAdmin.find({teachingStatus: 'teaching'},(err, user3)=>{
          hold="admin-schedules";
          res.render('admin/admin',{hold: hold, subject: user, section: user2, teacher: user3});
        }).sort({firstname:1});

      }).sort({strand:1, section:1});
    }).sort({courseTitle:1});
  }else{
    res.redirect('../login-form')
  }
});




router.get('/strands/add-section',(req, res)=>{
  if (req.session.username && req.session.password){
    subjectAdmin.find({},(err, user)=>{
      strandsAdmin.find({}, (err, user2)=>{

        hold="add-strands";
        option="section";
        res.render('admin/admin',{hold: hold, user:user, strands: user2, option:option});
      })
    });
  }else{
    res.redirect('/administrator/login-form')
  }
});



router.get('/strands/add-strands',(req, res)=>{
  if (req.session.username && req.session.password){
    subjectAdmin.find({},(err, user)=>{
      tracksAdmin.find({}, (err, user2)=>{
        hold="add-strands";
        option="strands"
        res.render('admin/admin',{hold: hold, user:user, tracks: user2, option:option});
      })
    })
  }else{
    res.redirect('/administrator/login-form')
  }
});

router.get('/strands/add-tracks',(req, res)=>{
  if (req.session.username && req.session.password){
    subjectAdmin.find({},(err, user)=>{
      hold="add-strands";
      option = "tracks";
      res.render('admin/admin',{hold: hold, user:user, option:option});
    })
  }else{
    res.redirect('/administrator/login-form')
  }
});


router.get('/settings/security',(req, res)=>{
  if (req.session.username && req.session.password){
    userAdmin.find({idNumber: req.session.username}, (err, user)=>{
      hold="settings-security";
      option="settings-security";
      res.render('admin/admin',{hold: hold, user: user, option: option});
    });
  }else{
    res.redirect('../login-form')
  }
});

 
router.get('/settings/enrollment',(req, res)=>{
  if (req.session.username && req.session.password){
    userAdmin.find({idNumber: req.session.username}, (err, user)=>{
        enrollmentSettings.find({}, (err, user2)=>{
          hold="settings-enrollment";
          option="settings-enrollment";
          res.render('admin/admin',{hold: hold, user: user, option: option, settings: user2});
        });
    });
  }else{
    res.redirect('../login-form')
  }
});

router.get('/verify-new-student/:studentInfo', (req, res)=>{
  req.session.studentObjectId = req.params.studentInfo;
  if (req.session.username && req.session.password){
    studentPending.find({_id: req.params.studentInfo},(err, user)=>{
      strandsAdmin.find({},(err, user2)=>{
        res.render('partials/admin/admin-verify-users',{hold: hold, student: user, strand: user2});
      });
    })
  }else{
    res.redirect('../login-form')
  }
});


router.get('/student-information/:studentInfo', (req, res)=>{
  req.session.studentObjectId = req.params.studentInfo;
  if (req.session.username && req.session.password){
    enrollStudent.find({_id: req.params.studentInfo},(err, user)=>{
      strandsAdmin.find({},(err, user2)=>{
        res.render('partials/admin/admin-student-information',{hold: hold, student: user, strand: user2});
      });
    })
  }else{
    res.redirect('../login-form')
  }
});









module.exports = router;
