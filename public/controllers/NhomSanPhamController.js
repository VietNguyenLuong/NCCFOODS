const category = require("../models/category");
const auth = require("../../config/authMiddleware");
exports.getcategory = async (req, res) => {
  try {
   const data = await category.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
exports.getall = async (req, res) => {
  try {
    console.log(1)
    const { name, page } = req.query;
    const query = {};
    if (name) query.ten_nhom = { $regex: name, $options: "i" };

    const limit = 10;
    const currentPage = Math.max(1, parseInt(page) || 1);
    const skip = (currentPage - 1) * limit;

    const totalcategorys = await category.countDocuments(query);
    const categorys = await category.find(query).skip(skip).limit(limit);

    const totalPages = Math.max(1, Math.ceil(totalcategorys / limit));

    // Tạo mảng pages như [{ num:1, isActive:false }, ...]
    const pages = Array.from({ length: totalPages }, (_, i) => {
      const p = i + 1;
      return { num: p, isActive: p === currentPage };
    });

    const prevPage = currentPage > 1;
    const nextPage = currentPage < totalPages;
    const prevPageNum = prevPage ? currentPage - 1 : null;
    const nextPageNum = nextPage ? currentPage + 1 : null;

    const showingStart = totalcategorys === 0 ? 0 : skip + 1;
    const showingEnd = Math.min(skip + categorys.length, totalcategorys);

    res.render("nhomsanphamQuanTri", {
      title: "Danh sách nhóm sản phẩm",
      categorys,
      keyword: name || "",
      currentPage,
      totalPages,
      pages,
      prevPage,
      nextPage,
      prevPageNum,
      nextPageNum,
      totalcategorys,
      showingStart,
      showingEnd
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Thêm nhóm sản phẩm mới
exports.createNhomSanPham = async (req, res) => {
  try {
    console.log(req.body)
    const data = new category(req.body);

    await data.save();

    console.log("✅ Lưu thành công:", data);
    res.redirect("getbypage"); // quay lại danh sách sau khi thêm
  } catch (err) {
    console.error("❌ Lỗi khi thêm nhóm sản phẩm:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Xem chi tiết
exports.getbyid = async (req, res) => {
  try {
    console.log(req.params.id)
    const nhom = await category.findById(req.params.id);
  res.render("chitietnhomsanpham", { nhom });
  } catch (err) {
    console.error("❌ Lỗi khi thêm nhóm sản phẩm:", err.message);
    res.status(400).json({ message: err.message });
  }
};
// Xóa 
exports.delete = async (req, res) => {
  try {
    await category.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa nhóm sản phẩm" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Cập nhật status theo id
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm user theo id
    const user = await category.findById(id);
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
exports.update = async (req, res) => {
  try {
    const { _id, ten_nhom } = req.body;

    await category.findByIdAndUpdate(
      _id,
      { ten_nhom },
      { new: true }
    );

    res.redirect("/nhomsanpham/getbypage");
  } catch (err) {
    console.error(err);
    res.status(400).send("Cập nhật thất bại");
  }
};