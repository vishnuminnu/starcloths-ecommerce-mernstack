import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema({
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Products", // Assuming your product model is named "Product"
    },
  ],
  payment: {
    // Define your payment schema here if needed
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "user", // Assuming your user model is named "User"
  },
  status: {
    type: String,
    default: "Not Process",
    enum: ["Not Process", "Processing", "Shipped", "Delivered", "Canceled"], // Fix enum values to match capitalization
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
