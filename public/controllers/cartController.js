const cart = require("../models/cart");
const auth = require("../../config/authMiddleware");
exports.create = async (req, res) => {
  try {
    console.log(req)
    // 1. Lặp qua từng item và lưu vào Order
        const newOrder = new cart({
          product_id: req.body.product_id,
          user_id: req.body.user_id,
          quantity: req.body.quantity,
          description: req.body.description || ""
        });
        await newOrder.save();
    res.json({ success: true, message: "Tạo đơn hàng thành công"});
  } catch (err) {
    console.error("❌ Lỗi khi tạo đơn hàng:", err);
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

// Lấy user theo ID
exports.ThemGioHang = async (req, res) => {
  try {
    const data = await products.findById(req.params.id); // lấy theo id trên URL
    if (!data) {
      return res.status(404).send("Không tìm thấy data");
    }
    // Nếu muốn render ra view:
   res.render({data });
  } catch (err) {
    res.status(500).send("Lỗi: " + err.message);
  }
};

exports.GetByUser = async (req, res) => {
  try {
    const userId = req.params.id;
     console.log(userId);
    const carts = await cart.find({ user_id: userId, status: { $ne: 9 } })
      .populate("product_id", " name image_url price")
      .lean({ getters: true });
    // 👉 đổ field product ra ngang hàng
      const result = carts
      .filter(item => item.product_id) // 👈 loại cart lỗi
      .map(item => ({
        _id: item._id,
        user_id: item.user_id,
        quantity: item.quantity,

        product_id: item.product_id._id,
        name: item.product_id.name,
        image_url: item.product_id.image_url,
        price: Number(item.product_id.price)
      }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateCart = async (req, res) => {
  try {
    const carts = await cart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(carts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.ThemMoi = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    const qty = Number(quantity) || 1;

    await cart.updateOne(
      { user_id, product_id },
      { $inc: { quantity: qty } },
      { upsert: true }
    );

    res.json({ message: "OK" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa !" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật status theo id
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm user theo id
    const user = await products.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    // Đảo trạng thái: nếu 0 -> 1, nếu 1 -> 0
    user.status = user.status === 0 ? 1 : 0;
    await user.save();

    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      status: user.status,
    });
  } catch (err) {
    console.error("❌ Lỗi updateStatus:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.GetByOderId = async (req, res) => {
  try {
    const order_id = req.params.id;
    const carts = await cart.find({ order_id: order_id })
      .populate("product_id", " name image_url price")
      .lean({ getters: true });
    // 👉 đổ field product ra ngang hàng
      const result = carts
      .filter(item => item.product_id) // 👈 loại cart lỗi
      .map(item => ({
        _id: item._id,
        user_id: item.user_id,
        quantity: item.quantity,

        product_id: item.product_id._id,
        name: item.product_id.name,
        image_url: item.product_id.image_url,
        price: Number(item.product_id.price),
        total:Number(item.product_id.price) *item.quantity 
      }));
    res.render("thongtindonhang", { cart:result, order_id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.GetByOderIdUser = async (req, res) => {
  try {
    const order_id = req.params.id;
    const carts = await cart.find({ order_id: order_id })
      .populate("product_id", " name image_url price")
      .lean({ getters: true });
    // 👉 đổ field product ra ngang hàng
      const result = carts
      .filter(item => item.product_id) // 👈 loại cart lỗi
      .map(item => ({
        _id: item._id,
        user_id: item.user_id,
        quantity: item.quantity,

        product_id: item.product_id._id,
        name: item.product_id.name,
        image_url: item.product_id.image_url,
        price: Number(item.product_id.price),
        total:Number(item.product_id.price) *item.quantity 
      }));
    res.render("thongtindonhangUser", { cart:result, order_id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};