const express = require("express");
const router = express.Router();
const taikhoanController = require("../public/controllers/taikhoanController");

router.get("/", taikhoanController.getTaikhoans);
router.get("/danhsach", taikhoanController.getall);
router.post("/create", taikhoanController.createTaikhoan);
router.post("/update", taikhoanController.updateTaikhoan);
router.post("/updateQT", taikhoanController.update);
router.delete("/delete/:id", taikhoanController.deleteTaikhoan);
router.get("/getbyid/:id", taikhoanController.getById);
router.get("/getbyidQT/:id", taikhoanController.getByIdQT);
router.post("/updatestatus/:id", taikhoanController.updateStatus);
router.post("/login", taikhoanController.login);
router.post("/loginAdmin", taikhoanController.loginAdmin);
router.get('/user', function(req, res, next) {
  res.render('taikhoan');   // render views/hotro.jade
});

module.exports = router;
