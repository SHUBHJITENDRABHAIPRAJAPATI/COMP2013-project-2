// backend/models/product.js
// Mongoose model for products collection
const mongoose = require("mongoose");

// schema representing one product document in the products collection
const productSchema = new mongoose.Schema(
  {
    // it is the barcode/id from products.json
    id: {
      type: String,
      required: true,
      
    
    },
    productName: {
      type: String,
      required: true,
     
    },
    brand: {
      type: String,
      required: true,
      
    },
    image: {
      type: String,
      required: false,
    
    },
    // Price is stored as a string (e.g. "$3.65") to match the JSON exactly
    price: {
      type: String,
      required: true, 
    },
  },
  {
    // automatically manage createdAt and updatedAt fields bcz i found error on my webpage without it
    timestamps: true, 
  }
);

// create and export the product to model
const Product = mongoose.model("Product", productSchema,);

module.exports = Product;
