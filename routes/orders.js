var express = require('express');
var ordersController = require("../public/controllers/ordersController");
var cartController = require("../public/controllers/cartController");
var router = express.Router();
const requireLogin = require("../config/authMiddleware");
const upload = require("../middlewares/upload");

router.get('/thongtindonhang/:id', cartController.GetByOderId);
router.get('/thongtindonhanguser/:id', cartController.GetByOderIdUser);
router.post("/themmoi",upload.single("image"), ordersController.create);
router.post("/tinhtongtien", ordersController.TinhTongTien);
router.post("/tonghoadonmes", ordersController.TongHoaDonMes);
router.post("/updatestatus", ordersController.updateStatus);
router.get("/getbyuser/:id", ordersController.GetOrderByUser);
router.get("/getall",requireLogin, ordersController.getall);
router.get("/getallByPrepare",requireLogin, ordersController.getallByPrepare);
router.delete("/delete/:id", ordersController.delete);
module.exports = router;