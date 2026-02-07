var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
  res.render('login');   // render views/hotro.jade
});

module.exports = router;