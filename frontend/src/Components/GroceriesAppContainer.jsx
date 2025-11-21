// src/Components/GroceriesAppContainer.jsx
import { useState, useEffect } from "react";
import CartContainer from "./CartContainer";
import axios from "axios";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import { useForm } from "react-hook-form";

export default function GroceriesAppContainer({ products: initialProducts }) {
  // products from backend / props
  const [products, setProducts] = useState(initialProducts || []);

  // quantity per product (by id)
  const [productQuantity, setProductQuantity] = useState(
    (initialProducts || []).map((product) => ({ id: product.id, quantity: 0 }))
  );

  // cart list is an ARRAY of products
  const [cartList, setCartList] = useState([]);

  // form data for add/edit product (kept in state so we can prefill on edit)
  const [formData, setFormData] = useState({
    id: "",
    productName: "",
    brand: "",
    image: "",
    price: "",
  });

  const [postResponse, setPostResponse] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: formData,
  });

  // 🔹 Load products from backend on mount
  useEffect(() => {
    handleConnectDB();
  }, []);

  // 🔹 Rebuild quantity array whenever products change
  useEffect(() => {
    setProductQuantity(
      products.map((product) => ({ id: product.id, quantity: 0 }))
    );
  }, [products]);

  // 🔹 Keep react-hook-form in sync when we change formData (e.g. on Edit)
  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  // ================== BACKEND / DB HANDLERS ==================

  // GET /products
  const handleConnectDB = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products from backend:", error);
    }
  };

  // change handler to keep local formData in sync (inputs also use react-hook-form)
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // form submit (ADD / UPDATE) – react-hook-form passes `data`
  const handleOnSubmit = async (data) => {
    try {
      if (isEditing) {
        // 🔄 UPDATE existing product
        // make sure formData has the latest fields
        setFormData((prev) => ({ ...prev, ...data }));
        await handleUpdate(formData._id, { ...formData, ...data });
        setIsEditing(false);
      } else {
        // ✚ CREATE new product
        const response = await axios.post(
          "http://localhost:3000/products",
          data
        );
        setPostResponse(
          response.data.message || "Product added successfully!"
        );
      }

      // clear form
      const emptyData = {
        id: "",
        productName: "",
        brand: "",
        image: "",
        price: "",
      };
      setFormData(emptyData);
      reset(emptyData);

      // refresh list from DB
      await handleConnectDB();
    } catch (error) {
      console.error("Error submitting form:", error);
      setPostResponse("Error submitting form. Please try again.");
    }
  };

  // click "Edit" on a card → prefill form
  const handleEdit = (product) => {
    setIsEditing(true);
    const newFormData = {
      _id: product._id, // MongoDB id for PATCH/DELETE URL
      id: product.id,
      productName: product.productName,
      brand: product.brand,
      image: product.image,
      price: product.price,
    };
    setFormData(newFormData);
    reset(newFormData); // sync react-hook-form fields
  };

  // PATCH /products/:id
  const handleUpdate = async (id, dataOverride) => {
    const data = dataOverride || formData;
    try {
      const response = await axios.patch(
        `http://localhost:3000/products/${id}`,
        {
          id: data.id,
          productName: data.productName,
          brand: data.brand,
          image: data.image,
          price: data.price,
        }
      );
      setPostResponse(
        response.data.message || "Product updated successfully!"
      );
      await handleConnectDB();
    } catch (error) {
      console.log(error.message);
      setPostResponse("Error updating product. Please try again.");
    }
  };

  // DELETE /products/:id
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/products/${id}`
      );
      setPostResponse(
        response.data.message || "Product deleted successfully!"
      );
      await handleConnectDB();
    } catch (error) {
      console.log(error.message);
      setPostResponse("Error deleting product. Please try again.");
    }
  };

  // ================== CART / QUANTITY HANDLERS ==================

  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
    }
  };

  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
    }
  };

  const handleAddToCart = (productId) => {
    const product = products.find((product) => product.id === productId);
    const pQuantity = productQuantity.find(
      (product) => product.id === productId
    );

    if (!product || !pQuantity) return;

    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product.id === productId
    );

    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };

  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product.id !== productId);
    setCartList(newCartList);
  };

  const handleClearCart = () => {
    setCartList([]);
  };

  // ================== RENDER ==================

  return (
    <div>
      <NavBar quantity={cartList.length} />
      <div className="GroceriesApp-Container">
        <ProductsContainer
          products={products}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
          // CRUD / form props
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          formData={formData}
          handleOnChange={handleOnChange}
          handleOnSubmit={handleOnSubmit}
          postResponse={postResponse}
          isEditing={isEditing}
          // react-hook-form props
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          reset={reset}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}
