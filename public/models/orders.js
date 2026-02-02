const mongoose = require("mongoose");

function generateBigCode() {
  return BigInt(Date.now()) * 1000n + BigInt(Math.floor(Math.random() * 1000));
}
const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  code : { type: String, default:generateBigCode()},
  status: { type: Number, default: 0 },
  total: { type: mongoose.Schema.Types.Decimal128, required: true},
  order_date: { type: Date, default: Date.now },
  xpected_delivery_date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  description: String,
  image: { type: String},
  username: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      unique: true,
    },
});

module.exports = mongoose.model("Order", orderSchema);