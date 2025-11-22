// src/Components/GroceriesAppContainer.jsx

// importing necessary modules and components
import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import ProductsContainer from "./ProductsContainer";
import CartContainer from "./CartContainer";
import { useForm } from "react-hook-form"; // imported like in the lecture (even if you don't use it yet)

export default function GroceriesAppContainer() {
  // STATES

  // product list from the database
  const [items, setItems] = useState([]);

  // quantity selector for each product (for the products list)
  const [quantities, setQuantities] = useState([]);

  // cart items
  const [cartItems, setCartItems] = useState([]);

  // editing state for the product form
  const [isEditing, setIsEditing] = useState(false);

  // form data for add / edit product
  const [formData, setFormData] = useState({
    id: "",
    productName: "",
    brand: "",
    image: "",
    price: "",
  });

  // Message from the server (success / error)
  const [serverMessage, setServerMessage] = useState("");

  // fetch products from database on component mount

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products");
      setItems(res.data);

      // Build / rebuild quantity tracker for each product
      setQuantities(
        res.data.map((item) => ({
          id: item.id,
          qty: 0,
        }))
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  //////////////////////////////////////////
  // FORM HANDLERS (similar to handleOnchange / handleOnSubmit)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update existing product
        await updateProduct(formData._id);
        setIsEditing(false);
      } else {
        // Add new product
        await axios
          .post("http://localhost:3000/products", formData)
          .then((res) => setServerMessage(res.data.message));
      }

      // Reset form
      setFormData({
        id: "",
        productName: "",
        brand: "",
        image: "",
        price: "",
      });

      // Refresh product list
      loadProducts();
    } catch (error) {
      console.log(error.message);
      setServerMessage("Something went wrong.");
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

  //////////////////////////////////////////
  // UPDATE AND DELETE HANDLERS (similar to handleUpdate / handleDelete)

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
      console.log(error.message);
    }
  };

  //////////////////////////////////////////
  // QUANTITY LOGIC (replaces handleAddQuantity / handleRemoveQuantity)

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

  //////////////////////////////////////////
  // CART HANDLERS (similar idea to your old cartList logic)

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

  //////////////////////////////////////////
  // RENDER

  return (
    <div className="groceries-app">
      {/* NavBar gets number of items in cart */}
      <NavBar quantity={cartItems.length} />

      <div className="GroceriesApp-Container">
        {/* Products section: list + form + edit/delete */}
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

        {/* Cart section */}
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
