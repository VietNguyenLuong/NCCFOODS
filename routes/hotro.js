var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('hotro');   // render views/hotro.jade
});

module.exports = router;