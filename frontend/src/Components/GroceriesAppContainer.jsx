// src/Components/GroceriesAppContainer.jsx

/*
in this file,i render the main GroceriesAppContainer component which manages the overall state and logic of the groceries app.
it handles product fetching, quantity adjustments, cart management, and product add/edit/delete operations.
it uses axios for backend communication and react hooks for state management.
*/
/*
note:
i got the error in GroceriesAppContainer.jsx file while defining the function updateProduct() inside handleSubmit() function
the error was "updateProduct is not defined"
to fix this error,i moved the function updateProduct() outside the handleSubmit() function and defined it as a separate function inside GroceriesAppContainer.jsx
this way,updateProduct() is properly defined and can be called from handleSubmit() without any issues.
*/

/*
the groceryappcontainer.jsx file i copy concept from youtube video,which was for the shopping cart app
reference link:https://www.youtube.com/watch?v=uMBgUUPkgUY
*/

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

  // message from the server (success / error)
  const [serverMessage, setServerMessage] = useState("");

  // fetch products from database on component mount

  useEffect(() => {
    loadProducts();
  }, []);
  
// function to load products from the backend
  const loadProducts = async () => {
    try {

      const response = await axios.get("http://localhost:3000/products");
      setItems(response.data);

      // Build / rebuild quantity tracker for each product
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

  // form handlers 

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // update existing product
        await updateProduct(formData._id);
        setIsEditing(false);
      } else {
        // add new product
        await axios
          .post("http://localhost:3000/products", formData)
          .then((res) => setServerMessage(res.data.message));
      }

      // reset form
      setFormData({
        id: "",
        productName: "",
        brand: "",
        image: "",
        price: "",
      });

      // refresh product list
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

  // update and delete handlers 

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
// delete product handler
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

  // quantity logic (for products and cart)

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
    // add to cart logic

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

  // remove from cart handler
  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((p) => p.id !== id));

  const clearCart = () => setCartItems([]);

  // rendering the component for App.jsx

  return (
    <div className="groceries-app">
      {/* navBar gets number of items in cart */}
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


