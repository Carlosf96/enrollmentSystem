const router = require('express').Router();

var holder = "";

router.get('/requirements',(req, res)=>{
  holder = "requirements";
  res.render('./dsashs/requirements', {hold: holder});
});

router.get('/facilities',(req, res)=>{
  holder = "facilities";
  res.render('./dsashs/facilities', {hold: holder});
});



module.exports = router;
