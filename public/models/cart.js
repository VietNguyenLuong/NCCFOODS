const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  quantity: {   type: Number, required: true },
  status: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  description: String,
});

module.exports = mongoose.model("cart", cartSchema);