// src/Components/ProductsContainer.jsx
import ProductCard from "./ProductCard";

export default function ProductsContainer({
  products,
  quantities,
  adjustQuantity,
  addToCart,
  handleEdit,
  handleDelete,
  formData,
  handleChange,
  handleSubmit,
  isEditing,
  serverMessage,
}) {
  // find current qty for a product
  const getQuantityForProduct = (id) => {
    const entry = quantities.find((q) => q.id === id);
    return entry ? entry.qty : 0;
  };

  // wrappers for QuantityCounter in "product" mode
  const handleAddQuantity = (id, mode) => {
    adjustQuantity(id, "inc", "product");
  };

  const handleRemoveQuantity = (id, mode) => {
    adjustQuantity(id, "dec", "product");
  };

  return (
    <div className="ProductsContainer">
      {/* Product form is one “card” in the grid, like in the reference */}
      <div className="ProductCard ProductForm">
        <h3>Product Form</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="id">Product Id</label>
            <input
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="Barcode / Id"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="$2.50"
              required
            />
          </div>

          <button type="submit">{isEditing ? "Update" : "Submit"}</button>
        </form>

        {serverMessage && (
          <p className="form-message">{serverMessage}</p>
        )}
      </div>

      {/* Product cards – same basic mapping as professor’s version */}
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          id={product.id}
          productName={product.productName}
          brand={product.brand}
          image={product.image}
          price={product.price}
          productQuantity={getQuantityForProduct(product.id)}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={addToCart}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          mongoId={product._id}
        />
      ))}
    </div>
  );
}
