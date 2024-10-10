import mongoose from "mongoose";

const orderDishSchema = new mongoose.Schema({
  order_date: {
    type: Date,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  invoice_report_url: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    required: true,
  },
});

// Modelo OrderDish
export const OrderDish = mongoose.model("OrderDish", orderDishSchema);
