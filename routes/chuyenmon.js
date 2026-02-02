var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('chuyenmon');   // render views/hotro.jade
});

module.exports = router;