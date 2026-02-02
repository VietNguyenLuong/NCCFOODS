const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  ten_nhom: { type: String, required: true },
});

module.exports = mongoose.model("nhom_san_pham", categorySchema);