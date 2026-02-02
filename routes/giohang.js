var express = require('express');
var cartController = require("../public/controllers/cartController");
var router = express.Router();
const cart = require("../public/models/cart");
const Order = require("../public/models/orders");
router.put("/update-qty", async (req, res) => {
  try {
    const { itemId, quantity,  order_id } = req.body;
    console.log(order_id)
    if (!itemId || !quantity || quantity < 1 || !order_id ) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ"
      });
    }

    // tìm item trong cart
    const item = await cart.findById(itemId);
    if (!item) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm"
      });
    }

    // update
    item.quantity = quantity;
    item.total = item.price * quantity;

    await item.save();
    // 2️⃣ Lấy tất cả item cùng order_id
    const items = await cart.find({ order_id })
     .populate("product_id", " name image_url price")
      .lean({ getters: true });;
console.log(items)
    // 3️⃣ Tính tổng tiền đơn hàng
    const orderTotal = items.reduce((sum, i) => {
      return sum + i.product_id.price * i.quantity;
    }, 0);

    // 4️⃣ Update total cho bảng orders
    await Order.findByIdAndUpdate(order_id, {
      total: orderTotal
    });


    res.json({
      message: "Cập nhật thành công",
      item
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Lỗi server"
    });
  }
});
router.post("/themmoi", cartController.create);
router.post("/checkthemmoi", cartController.ThemMoi);
router.get("/getbyuser/:id", cartController.GetByUser);
router.get("/update/:id", cartController.updateCart);
router.delete("/delete/:id", cartController.delete);
module.exports = router;