// adding all functionalities of groceries app container
//importing necessary libraries and components as per requirement
import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import ProductsContainer from "./ProductsContainer";
import CartContainer from "./CartContainer";
import { response } from "express";

export default function GroceriesAppContainer() {

  // state
  const [items, setItems] = useState([]); // Product list
  const [quantities, setQuantities] = useState([]); // Quantity selector for each product
  const [cartItems, setCartItems] = useState([]); // Cart array
  const [isEditing, setIsEditing] = useState(false);// editing mode for form
// form data state
  const [formData, setFormData] = useState({
    id: "",
    productName: "",
    brand: "",
    image: "",
    price: "",
  });

  // server message state
  const [serverMessage, setServerMessage] = useState("");

  // load product from MongoDB:from backend/server.js

  //useEffect to load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products");
      setItems(response.data);

      // setting quantities for each product to 0 initially
      setQuantities(
        response.data.map((item) => ({
          id: item.id,
          qty: 0,
        }))
      );
    } catch (error) {
      console.log(error.message);
    }
  };
 
  // Handling form data
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateProduct(formData._id);
        setIsEditing(false);
      } else {
        await axios
          .post("http://localhost:3000/products", formData)
          .then((res) => setServerMessage(res.data.message));
      }

      setFormData({
        id: "",
        productName: "",
        brand: "",
        image: "",
        price: "",
      });

      loadProducts();
    } catch (error) {
      console.log(error.message);
      
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setFormData({
      _id: product._id,
      id: product.id,
      productName: product.productName,
      brand: product.brand,
      image: product.image,
      price: product.price,
    });
  };

  // update and delete product functions
  const updateProduct = async (mongoId) => {
    try {
      await axios
        .patch(`http://localhost:3000/products/${mongoId}`, formData)
        .then((res) => setServerMessage(res.data.message));

      loadProducts();
    } catch (error) {
      console.log("Update Error:", error.message);
    }
  };

  const handleDelete = async (mongoId) => {
    try {
      await axios
        .delete(`http://localhost:3000/products/${mongoId}`)
        .then((res) => setServerMessage(res.data.message));

      loadProducts();
    } catch (error) {
      console.log("Delete Error:", error.message);
    }
  };

  // setting quantity logic
  const adjustQuantity = (id, type, source) => {
    const setter = source === "cart" ? setCartItems : setQuantities;

    setter((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty:
                type === "inc"
                  ? item.qty + 1
                  : item.qty > 0
                  ? item.qty - 1
                  : 0,
            }
          : item
      )
    );
  };

  // cart handlers
  const addToCart = (id) => {
    const item = items.find((p) => p.id === id);
    const selectedQty = quantities.find((q) => q.id === id)?.qty;

    if (!selectedQty || selectedQty === 0) {
      alert(`Please select quantity for ${item.productName}`);
      return;
    }

    setCartItems((prev) => {
      const exists = prev.find((p) => p.id === id);

      if (exists) {
        return prev.map((p) =>
          p.id === id ? { ...p, qty: p.qty + selectedQty } : p
        );
      }

      return [...prev, { ...item, qty: selectedQty }];
    });
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((p) => p.id !== id));

  const clearCart = () => setCartItems([]);

  // rendering the groceries app container with NavBar, ProductsContainer, and CartContainer
  return (
    <div className="groceries-app">
      <NavBar quantity={cartItems.length} />

      <div className="GroceriesApp-Container">
        <ProductsContainer
          products={items}
          quantities={quantities}
          adjustQuantity={adjustQuantity}
          addToCart={addToCart}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isEditing={isEditing}
          serverMessage={serverMessage}
        />

        <CartContainer
          cartList={cartItems}
          adjustQuantity={adjustQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
        />
      </div>
    </div>
  );
}
