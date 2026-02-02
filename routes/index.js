var express = require('express');
var productsController = require("../public/controllers/productsController");
var router = express.Router();

router.get("/", productsController.getproducts);
module.exports = router;
