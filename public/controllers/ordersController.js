const orders = require("../models/orders");
const cart = require("../models/cart");
const auth = require("../../config/authMiddleware");
const Taikhoan = require("../models/taikhoan");
const mongoose = require("mongoose");

exports.getall = async (req, res) => {
  try {
    const { name, page } = req.query;
    const query = {};
    if (name) query.name = { $regex: name, $options: "i" };
    query.status = 1;
    const limit = 10;
    const currentPage = Math.max(1, parseInt(page) || 1);
    const skip = (currentPage - 1) * limit;

    const totalorders = await orders.countDocuments(query);
    const orderss = await orders.find(query).skip(skip).limit(limit);
    const totalPages = Math.max(1, Math.ceil(totalorders / limit));

    // Tạo mảng pages như [{ num:1, isActive:false }, ...]
    const pages = Array.from({ length: totalPages }, (_, i) => {
      const p = i + 1;
      return { num: p, isActive: p === currentPage };
    });

    const prevPage = currentPage > 1;
    const nextPage = currentPage < totalPages;
    const prevPageNum = prevPage ? currentPage - 1 : null;
    const nextPageNum = nextPage ? currentPage + 1 : null;

    const showingStart = totalorders === 0 ? 0 : skip + 1;
    const showingEnd = Math.min(skip + orderss.length, totalorders);

    res.render("donhangQuanTri", {
      title: "Danh sách sản phẩm",
      orderss,
      keyword: name || "",
      currentPage,
      totalPages,
      pages,
      prevPage,
      nextPage,
      prevPageNum,
      nextPageNum,
      totalorders,
      showingStart,
      showingEnd
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getallByPrepare = async (req, res) => {
  try {
    const { name, page } = req.query;
    const query = {};
    if (name) query.name = { $regex: name, $options: "i" };
    query.status = 2;
    const limit = 10;
    const currentPage = Math.max(1, parseInt(page) || 1);
    const skip = (currentPage - 1) * limit;

    const totalorders = await orders.countDocuments(query);
    const orderss = await orders.find(query).skip(skip).limit(limit);
    const totalPages = Math.max(1, Math.ceil(totalorders / limit));

    // Tạo mảng pages như [{ num:1, isActive:false }, ...]
    const pages = Array.from({ length: totalPages }, (_, i) => {
      const p = i + 1;
      return { num: p, isActive: p === currentPage };
    });

    const prevPage = currentPage > 1;
    const nextPage = currentPage < totalPages;
    const prevPageNum = prevPage ? currentPage - 1 : null;
    const nextPageNum = nextPage ? currentPage + 1 : null;

    const showingStart = totalorders === 0 ? 0 : skip + 1;
    const showingEnd = Math.min(skip + orderss.length, totalorders);

    res.render("lendonhangQuanTri", {
      title: "Danh sách sản phẩm",
      orderss,
      keyword: name || "",
      currentPage,
      totalPages,
      pages,
      prevPage,
      nextPage,
      prevPageNum,
      nextPageNum,
      totalorders,
      showingStart,
      showingEnd
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.create = async (req, res) => {
  try {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + 3);
    // const imagePath = req.body.image ? "/image_source/" + req.body.image : null;
    console.log(req.imagePath)
    // 1️⃣ Tạo đơn hàng
    // const newOrder = new orders({
    //   user_id: req.body.user_id,
    //   total: req.body.quantity,
    //   image: imagePath,
    //   username: req.body.username,
    //   phone: req.body.phone,
    //   address: req.body.address,
    //   status: 1,
    //   xpected_delivery_date: expectedDate,
    //   description: req.body.description || ""
    // });
const imageName = req.file? "/image_source/" + req.file?.filename : null; // tên file multer lưu
     const newOrder = new orders({
      total: req.body.quantity,
      user_id: req.body.user_id,
      image: imageName,
      username: req.body.username,
      phone: req.body.phone,
      address: req.body.address,
      status: 1,
      xpected_delivery_date: expectedDate,
      description: req.body.description || ""
    });
    await newOrder.save();

    // 2️⃣ Update cart theo listId
    await cart.updateMany(
      { _id: { $in: JSON.parse(req.body.listId) } }, // điều kiện
      {
        $set: {
          order_id: newOrder._id,
          status: 9
        }
      }
    );

    res.json({
      success: true,
      message: "Tạo đơn hàng thành công"
    });

  } catch (err) {
    console.error("❌ Lỗi khi tạo đơn hàng:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: err.message
    });
  }
};
// Xóa sản phẩm
exports.delete = async (req, res) => {
  try {
    await orders.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa đơn hàng" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.GetByUser = async (req, res) => {
  try {
    const userId = req.params.id;
     console.log(userId);
    const orderss = await orders.find({ user_id: userId  })
      .populate("product_id", " name image_url price")
      .lean({ getters: true });
    // 👉 đổ field product ra ngang hàng
      const result = orderss
      .filter(item => item.product_id) // 👈 loại orders lỗi
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
// controller/cart.controller.js
exports.TinhTongTien = async (req, res) => {
  const { arrayId } = req.body;

  const ids = arrayId.map(id => new mongoose.Types.ObjectId(id));

  const result = await cart.aggregate([
    { $match: { _id: { $in: ids } } },
    {
      $lookup: {
        from: "products",
        localField: "product_id",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $addFields: {
        itemTotal: { $multiply: ["$quantity", "$product.price"] }
      }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$itemTotal" }
      }
    }
  ]);

  res.json({ total: result[0]?.totalAmount || 0 });
};
exports.GetOrderByUser = async (req, res) => {
  try {
    const userId = req.params.id;

      // 1️⃣ Query params
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const keyword = req.query.keyword || "";

    const user = await Taikhoan.findById(userId);
    const data = await orders.find({ user_id: userId , status : 1 }).skip(skip)
      .limit(limit);

    // 5️⃣ Tổng trang
    const ordersSuccess = await orders.find({ user_id: userId , status : { $ne: 1 } }).skip(skip)
      .limit(limit);

    // 5️⃣ Tổng trang
    // const totalPages = Math.ceil(totalItems / limit);
    // 👉 đổ field product ra ngang hàng
    res.render("taikhoan", {
      layout: "layout",
      data : data,
      ordersSuccess,
      user,
      currentPage: page,
      keyword
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.TongHoaDonMes = async (req, res) => {
  const { arrayId } = req.body;

  const ids = arrayId.map(id => new mongoose.Types.ObjectId(id));

  const result = await cart.aggregate([
    { $match: { _id: { $in: ids } } },

    {
      $lookup: {
        from: "products",
        localField: "product_id",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },

    // 💰 tiền từng sản phẩm
    {
      $addFields: {
        itemTotal: { $multiply: ["$quantity", "$product.price"] }
      }
    },

    // 🧾 tạo chuỗi "Tên SP (tiền)"
    {
      $addFields: {
        itemText: {
          $concat: [
            " x",
        { $toString: "$quantity" },
        " ",
            "$product.name",
            " (",
            { $toString: "$itemTotal" },
            "đ)"
          ]
        }
      }
    },

    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$itemTotal" },
        itemsText: { $push: "$itemText" }
      }
    },

    // 🔗 ghép bằng dấu +
    {
      $project: {
        _id: 0,
        totalAmount: 1,
        expression: {
          $reduce: {
            input: "$itemsText",
            initialValue: "",
            in: {
              $cond: [
                { $eq: ["$$value", ""] },
                "$$this",
                { $concat: ["$$value", " + ", "$$this"] }
              ]
            }
          }
        }
      }
    }
  ]);

  res.json({
    total: result[0]?.totalAmount || 0,
    text: result[0]?.expression || ""
  });
};
// Cập nhật status theo id
exports.updateStatus = async (req, res) => {
  try {
    const { id , status } = req.body;

    // Tìm user theo id
    const user = await orders.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    // Đảo trạng thái: nếu 0 -> 1, nếu 1 -> 0
    user.status = status;
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