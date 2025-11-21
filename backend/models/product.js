// backend/models/product.js
// mongoose for products collection
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
    price: {
      type: String,
      required: true, 
    },
  },
  {
    // automatically manage createdAt and updatedAt fields:it adds two fields createdAt and updatedAt to the schema and automatically updates them when a document is created or modified.
    timestamps: true, 
  }
);

// create and export the product to model
const Product = mongoose.model("Product", productSchema,);

module.exports = Product;
