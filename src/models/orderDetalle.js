import mongoose from "mongoose";

const orderDishItemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  order_dish_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderDish",
    required: true,
  },
    dish_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish",
        required: true,
    },
});

// Modelo
export const OrderDishItem = mongoose.model(
  "OrderDishItem",
  orderDishItemSchema
);
