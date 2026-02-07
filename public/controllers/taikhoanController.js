const Taikhoan = require("../models/taikhoan");
const jwt = require("jsonwebtoken");

exports.getall = async (req, res) => {
  try {
    console.log(1)
    const { name, page } = req.query;
    const query = {};
    if (name) query.username = { $regex: name, $options: "i" };

    const limit = 10;
    const currentPage = Math.max(1, parseInt(page) || 1);
    const skip = (currentPage - 1) * limit;

    const total = await Taikhoan.countDocuments(query);
    const data = await Taikhoan.find(query).skip(skip).limit(limit);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    // Tạo mảng pages như [{ num:1, isActive:false }, ...]
    const pages = Array.from({ length: totalPages }, (_, i) => {
      const p = i + 1;
      return { num: p, isActive: p === currentPage };
    });

    const prevPage = currentPage > 1;
    const nextPage = currentPage < totalPages;
    const prevPageNum = prevPage ? currentPage - 1 : null;
    const nextPageNum = nextPage ? currentPage + 1 : null;

    const showingStart = total === 0 ? 0 : skip + 1;
    const showingEnd = Math.min(skip + data.length, total);

    res.render("danhsachtaikhoanQuanTri", {
      title: "Danh sách tài khoản",
      data,
      keyword: name || "",
      currentPage,
      totalPages,
      pages,
      prevPage,
      nextPage,
      prevPageNum,
      nextPageNum,
      total,
      showingStart,
      showingEnd
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy danh sách tài khoản (có tìm kiếm theo username)
exports.getTaikhoans = async (req, res) => {
  try {
    const { username, page } = req.query;
    const query = {};
    if (username) query.username = { $regex: username, $options: "i" };

    const limit = 10;
    const currentPage = Math.max(1, parseInt(page) || 1);
    const skip = (currentPage - 1) * limit;

    const totalTaikhoans = await Taikhoan.countDocuments(query);
    const Taikhoans = await Taikhoan.find(query).skip(skip).limit(limit);

    const totalPages = Math.max(1, Math.ceil(totalTaikhoans / limit));

    // Tạo mảng pages như [{ num:1, isActive:false }, ...]
    const pages = Array.from({ length: totalPages }, (_, i) => {
      const p = i + 1;
      return { num: p, isActive: p === currentPage };
    });

    const prevPage = currentPage > 1;
    const nextPage = currentPage < totalPages;
    const prevPageNum = prevPage ? currentPage - 1 : null;
    const nextPageNum = nextPage ? currentPage + 1 : null;

    const showingStart = totalTaikhoans === 0 ? 0 : skip + 1;
    const showingEnd = Math.min(skip + Taikhoans.length, totalTaikhoans);

    res.render("taikhoan", {
      title: "Danh sách tài khoản",
      Taikhoans,
      keyword: username || "",
      currentPage,
      totalPages,
      pages,
      prevPage,
      nextPage,
      prevPageNum,
      nextPageNum,
      totalTaikhoans,
      showingStart,
      showingEnd
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Thêm sản phẩm mới
exports.createTaikhoan = async (req, res) => {
  try {
    console.log("📥 Dữ liệu nhận từ client:", req.body); // log dữ liệu gửi lên

    const data = new Taikhoan(req.body);
    await data.save();

    console.log("✅ Lưu thành công:", data); // log document sau khi lưu
   //// return exports.getTaikhoans(req, res);
    return res.redirect("/taikhoan/danhsach");
  } catch (err) {
    console.error("❌ Lỗi khi thêm sản phẩm:", err.message); // log lỗi
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật sản phẩm
exports.updateTaikhoan = async (req, res) => {
  try {
    const { username, _id, address, password,phone } = req.body;
     await Taikhoan.findByIdAndUpdate(
          _id,
          { username,
          password,
          address,
          phone,
           },
          { new: true }
        );
    res.redirect("/donhang/getbyuser/" + _id)
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Cập nhật sản phẩm
exports.update = async (req, res) => {
  try {
    const { username, _id, address, password,phone,role } = req.body;
     await Taikhoan.findByIdAndUpdate(
          _id,
          { username,
          password,
          address,
          phone,
          role
           },
          { new: true }
        );
    res.redirect("/taikhoan/danhsach")
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Xóa sản phẩm
exports.deleteTaikhoan = async (req, res) => {
  try {
    await Taikhoan.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa tài khoản" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy user theo ID
exports.getById = async (req, res) => {
  try {
    const user = await Taikhoan.findById(req.params.id); // lấy theo id trên URL
    if (!user) {
      return res.status(404).send("Không tìm thấy user");
    }

    // Nếu muốn trả JSON (API):
    // res.json(user);

    // Nếu muốn render ra view:
   res.render("TaiKhoan/detail", {  layout: "views/layout",  user });
  } catch (err) {
    res.status(500).send("Lỗi: " + err.message);
  }
};
// Lấy user theo ID
exports.getByIdQT = async (req, res) => {
  try {
    const account = await Taikhoan.findById(req.params.id); // lấy theo id trên URL
    if (!account) {
      return res.status(404).send("Không tìm thấy user");
    }

    // Nếu muốn trả JSON (API):
    // res.json(user);

    // Nếu muốn render ra view:
   res.render("chitiettaikhoan", {  layout: "views/layout",  account });
  } catch (err) {
    res.status(500).send("Lỗi: " + err.message);
  }
};
// Lấy user theo ID
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
    const user = await Taikhoan.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      "MY_SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({
      access_token: token,
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Lấy user theo ID
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ kiểm tra input
    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu tài khoản hoặc mật khẩu" });
    }

    // 2️⃣ tìm admin theo username + role
    const user = await Taikhoan
      .findOne({ username: username, role: "admin" })
      .select("+password"); // nếu schema có select:false

    if (!user) {
      return res.status(401).json({ message: "Sai tài khoản" });
    }
  console.log(password);
  console.log(user.password);
    // 3️⃣ so sánh mật khẩu (DB của bạn là plain text)
    if (password !== user.password) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }

    // 4️⃣ lưu session đăng nhập
    req.session.admin = {
      _id: user._id,
      username: user.username,
      role: user.role
    };
  console.log(req.session.admin)
    // 5️⃣ redirect sau khi login thành công
    return res.redirect("/sanpham/getall");

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Cập nhật status theo id
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm user theo id
    const user = await Taikhoan.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    // Đảo trạng thái: nếu 0 -> 1, nếu 1 -> 0
    user.isActive = user.isActive === 0 ? 1 : 0;
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