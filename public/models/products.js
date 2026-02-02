const mongoose = require("mongoose");
const productsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: {   type: mongoose.Schema.Types.Decimal128, required: true,
  get: v => (v ? Number(v.toString()) : null) },
  image_url: { type: String},
  description: String,
  stock: { type: Number, default: 0 },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Nhom_san_pham"},
 is_btb: { type: Boolean, default: false },
  is_general: { type: Boolean, default: false },
  status: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("product", productsSchema);