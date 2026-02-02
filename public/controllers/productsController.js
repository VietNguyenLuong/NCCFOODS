const products = require("../models/products");
const category = require("../models/category");
const auth = require("../../config/authMiddleware");
// Lấy danh sách tài khoản (có tìm kiếm theo name)
exports.getall = async (req, res) => {
  try {
    const { name, page } = req.query;
    const query = {};
    if (name) query.name = { $regex: name, $options: "i" };

    const limit = 10;
    const currentPage = Math.max(1, parseInt(page) || 1);
    const skip = (currentPage - 1) * limit;

    const totalproductss = await products.countDocuments(query);
    const productss = await products.find(query).skip(skip).limit(limit);
    const data = await category.find();
    const totalPages = Math.max(1, Math.ceil(totalproductss / limit));

    // Tạo mảng pages như [{ num:1, isActive:false }, ...]
    const pages = Array.from({ length: totalPages }, (_, i) => {
      const p = i + 1;
      return { num: p, isActive: p === currentPage };
    });

    const prevPage = currentPage > 1;
    const nextPage = currentPage < totalPages;
    const prevPageNum = prevPage ? currentPage - 1 : null;
    const nextPageNum = nextPage ? currentPage + 1 : null;

    const showingStart = totalproductss === 0 ? 0 : skip + 1;
    const showingEnd = Math.min(skip + productss.length, totalproductss);

    res.render("sanphamQuanTri", {
      title: "Danh sách sản phẩm",
      productss,
      category:data,
      keyword: name || "",
      currentPage,
      totalPages,
      pages,
      prevPage,
      nextPage,
      prevPageNum,
      nextPageNum,
      totalproductss,
      showingStart,
      showingEnd
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getproducts = async (req, res) => {
  try {
    const { name, page } = req.query;
    const dataParam = req.query.data || req.customData;
    const limit = 10;
    const currentPage = Math.max(1, parseInt(page) || 1);
    const skip = (currentPage - 1) * limit;

    // 🔎 Điều kiện tìm kiếm
    const matchStage = {};
    if (name) {
      matchStage.name = { $regex: name, $options: "i" };
    }

    // 🔥 Aggregate: join category + group
    const groupedProducts = await products.aggregate([
      { $match: matchStage },

      // 🔗 JOIN categories
      {
        $lookup: {
          from: "nhom_san_phams",        // tên collection
          localField: "category_id",
          foreignField: "_id",
          as: "nhom_san_phams"
        }
      },

      // 📌 category là mảng → lấy phần tử đầu
      { $unwind: "$nhom_san_phams" },

      // 🧩 Group theo category
      {
        $group: {
          _id: "$nhom_san_phams._id",
          category_name: { $first: "$nhom_san_phams.ten_nhom" },
          products: { $push: "$$ROOT" },
          total: { $sum: 1 }
        }
      },

      { $sort: { _id: 1 } }
    ]);
      console.log(groupedProducts)
    console.log(
      "GROUPED PRODUCTS:",
      JSON.stringify(groupedProducts, null, 2)
    );
    const parsedData = dataParam ? JSON.parse(dataParam) : [];
    console.log(groupedProducts)
    res.render("index", {
      title: "NCC.FOODS",
      groupedProducts,
      data: parsedData,
      cart: [],
      keyword: name || "",
      currentPage
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



// Lấy user theo ID
exports.getByIdQT = async (req, res) => {
  try {
    const product = await products.findById(req.params.id); // lấy theo id trên URL
    const data = await category.find();
    console.log(product)
    if (!product) {
      return res.status(404).send("Không tìm thấy data");
    }

    // Nếu muốn render ra view:
   res.render("chitietsanpham", {  product, category:data });
  } catch (err) {
    res.status(500).send("Lỗi: " + err.message);
  }
};

// Lấy user theo ID
exports.getById = async (req, res) => {
  try {
    const product = await products.findById(req.params.id); // lấy theo id trên URL
    console.log(product)
    if (!product) {
      return res.status(404).send("Không tìm thấy data");
    }

    // Nếu muốn render ra view:
   res.render("chitiet", {  data:product});
  } catch (err) {
    res.status(500).send("Lỗi: " + err.message);
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


exports.ThemVaoGioHang = async (req, res) => {
  try {
    const data = await products.findById(req.params.id); // lấy theo id trên URL
    if (!data) {
      return res.status(404).send("Không tìm thấy data");
    }
    // Nếu muốn render ra view:
   res.json(data);
  } catch (err) {
    res.status(500).send("Lỗi: " + err.message);
  }
};


exports.getByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // 1️⃣ Query params
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const keyword = req.query.keyword || "";

    // 2️⃣ Điều kiện query
    const condition = {
      category_id: categoryId
    };

    // 👉 search theo name (LIKE %keyword%)
    if (keyword) {
      condition.name = { $regex: keyword, $options: "i" }; 
      // i = không phân biệt hoa thường
    }

    // 3️⃣ Đếm tổng
    const totalItems = await products.countDocuments(condition);

    // 4️⃣ Lấy data
    const data = await products.find(condition)
      .skip(skip)
      .limit(limit);

    // 5️⃣ Tổng trang
    const totalPages = Math.ceil(totalItems / limit);

    res.render("sanpham", {
      layout: "layout",
      data,
      currentPage: page,
      totalPages,
      categoryId,
      keyword
    });
  } catch (err) {
    res.status(500).send("Lỗi: " + err.message);
  }
};
// Thêm sản phẩm mới
exports.createproducts = async (req, res) => {
  try {
    console.log("📥 Dữ liệu nhận từ client:", req.body);
    console.log("📥 File upload:", req.file);
    req.body.is_btb = !!req.body.is_btb;
    req.body.is_general = !!req.body.is_general;
    const { name, stock, price, description,is_btb,is_general, category_id } = req.body;
    const imagePath = req.file ? "/image_source/" + req.file.filename : null;

    const data = new products({
      name,
      stock,
      price,
      category_id,
      description,
      image_url: imagePath, // thêm ảnh vào schema
      is_btb,
      is_general
    });

    await data.save();

    console.log("✅ Lưu thành công:", data);
    res.redirect("/sanpham/getall"); // quay lại danh sách sau khi thêm
  } catch (err) {
    console.error("❌ Lỗi khi thêm sản phẩm:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật sản phẩm
exports.updateproducts = async (req, res) => {
  try {
    const products = await products.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa sản phẩm
exports.deleteproducts = async (req, res) => {
  try {
    await products.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa sản phẩm" });
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
exports.update = async (req, res) => {
  try {
    req.body.is_btb = !!req.body.is_btb;
    req.body.is_general = !!req.body.is_general;
    const {_id, name, stock, price, description,is_btb,is_general, category_id } = req.body;
    const imagePath = req.file ? "/image_source/" + req.file.filename : null;

    await products.findByIdAndUpdate(
      _id,
      { name,
      stock,
      price,
      category_id,
      description,
      image_url: imagePath, // thêm ảnh vào schema
      is_btb,
      is_general },
      { new: true }
    );

    res.redirect("/sanpham/getall");
  } catch (err) {
    console.error(err);
    res.status(400).send("Cập nhật thất bại");
  }
};