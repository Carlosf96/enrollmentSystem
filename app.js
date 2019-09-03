const express = require('express');
const adminRoute = require('./routes/admin-route');
const studentRoute = require('./routes/student-route');
const dsashsRoute = require('./routes/dsashs-route');
const myControl = require('./controller/myController.js');
const studentControl = require('./controller/student-controller.js');
const keys = require('./config/keys');
const session = require('express-session');
const bodyParser = require('body-parser');
const request = require('request');
const passport = require('passport');
const pdfRoute = require('./routes/pdfmake-route');
const enrollmentSettings = require('./models/admin-enrollment-settings-model.js');
const userAdmin = require('./models/admin-user-model');
const mongoose = require('mongoose');

console.log('updated');

var port = process.env.PORT || 3000;
mongoose.Promise = global.Promise;
// mongoose.set('debug', true);
mongoose
  .connect(process.env.MONGO_URI || keys.mongodb.url, { useNewUrlParser: true })
  .then(() => console.log('MongDB connected sucessfully'))
  .catch(err => console.log(err));

var dateTime = require('node-datetime');
var cron = require('node-cron');

const app = express();
myControl(app);
studentControl(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/pdfMake', pdfRoute);
app.use(
  session({
    secret: keys.sessionKey.secretKey,
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/assets', express.static('assets'));
app.use('/administrator', adminRoute);
app.use('/student', studentRoute);
app.use('/dsashs', dsashsRoute);
app.set('view engine', 'ejs');

var holder = '';

app.get('/', (req, res) => {
  enrollmentSettings.find({}, (err, user) => {
    userAdmin.find({}, (err, user2) => {
      if (user2.length === 0) {
        new userAdmin({
          idNumber: keys.newUser.idNumber,
          lastname: keys.newUser.lastname,
          middlename: keys.newUser.middlename,
          firstname: keys.newUser.firstname,
          userType: keys.newUser.userType,
          phoneNumber: keys.newUser.phoneNumber,
          gender: keys.newUser.gender,
          password: keys.newUser.locations,
          teachingStatus: keys.newUser.teachingStatus
        }).save();
      }
    });
    if (user.length === 0) {
      new enrollmentSettings({
        _id: '5d5eac152b3cd10e8c764ef0',
        enrollmentStatus: 'enable',
        academicFirst: '2019',
        academicEnds: '2020',
        semester: '2nd Semester'
      }).save();
    } else {
      holder = 'home';
      res.render('app', { settings: user, hold: holder });
    }
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(port, () => {
  console.log('Server is now listening to port 3000');
});
