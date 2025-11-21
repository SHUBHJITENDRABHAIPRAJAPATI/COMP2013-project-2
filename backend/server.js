// backend/server.js
// Express server for products API
//stating server and connecting to database

const express = require("express");
const server = express();
const port = 3000;
const { request, response } = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//get the database uri from environment variables
const { DB_URI } = process.env;

// will import the product model to interact with products collection in the database
const Product = require("./models/product");

// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors()); // enable CORS for all routes

// Connect to MongoDB and start the server
mongoose
  .connect(DB_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database", error.message);
  });

// Routes

// simple route to check if server is running
server.get("/", (request, response) => {
  response.send("server is live");
});

// GET /products
// Get all products from db
server.get("/products", async (request, response) => {
  try {
    const products = await Product.find();
    response.send(products);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// POST /products
// add new product to the db
server.post("/products", async (request, response) => {
  const { id, productName, brand, image, price } = request.body;

  const newProduct = new Product({
    id,
    productName,
    brand,
    image,
    price,
  });

  try {
    await newProduct.save();
    response.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

// DELETE /products/:id
// delete a product
server.delete("/products/:id", async (request, response) => {
  const { id } = request.params;
  const objectId = new mongoose.Types.ObjectId(id); // Convert id to Mongoose ObjectId

  try {
    await Product.findByIdAndDelete(objectId);
    response.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
});

// PATCH /products/:id
// update an existing product in db
server.patch("/products/:id", async (request, response) => {
  const { id } = request.params;
  const { id: productId, productName, brand, image, price } = request.body;
  const objectId = new mongoose.Types.ObjectId(id); // Convert id to Mongoose ObjectId

  try {
    await Product.findByIdAndUpdate(objectId, {
      id: productId,
      productName,
      brand,
      image,
      price,
    }).then((result) => {
      console.log(result);
    });

    await response
      .status(200)
      .json({ message: "Product updated successfully" });
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
});