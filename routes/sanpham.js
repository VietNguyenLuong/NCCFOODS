var express = require('express');
var router = express.Router();
const upload = require("../middlewares/upload");
const requireLogin = require("../config/authMiddleware");
var productsController = require("../public/controllers/productsController");

router.get('/sanpham', function(req, res, next) {
  res.render('sanpham');   // render views/hotro.jade
});
router.get("/getbyid/:id", productsController.getById);
router.get("/getbyidqt/:id", productsController.getByIdQT);
router.get("/getall",requireLogin, productsController.getall);
router.get("/getbycategory/:categoryId", productsController.getByCategory);
router.get("/themgiohang/:id", productsController.ThemGioHang);
router.get("/themvaogiohang/:id", productsController.ThemVaoGioHang);
router.delete("/delete/:id", productsController.deleteproducts);
router.post("/updatestatus/:id", productsController.updateStatus);
router.post("/update/",upload.single("image_url"), productsController.update);
router.post("/create",upload.single("image_url"), productsController.createproducts);
module.exports = router;