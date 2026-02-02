const express = require("express");
const router = express.Router();
const taikhoanController = require("../public/controllers/taikhoanController");

router.get("/", taikhoanController.getTaikhoans);
router.post("/create", taikhoanController.createTaikhoan);
router.post("/update", taikhoanController.updateTaikhoan);
router.delete("/delete/:id", taikhoanController.deleteTaikhoan);
router.get("/getbyid/:id", taikhoanController.getById);
router.post("/updatestatus/:id", taikhoanController.updateStatus);
router.post("/login", taikhoanController.login);
router.get('/user', function(req, res, next) {
  res.render('taikhoan');   // render views/hotro.jade
});

module.exports = router;
