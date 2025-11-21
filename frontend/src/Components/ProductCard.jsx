// src/Components/ProductsContainer.jsx
import ProductCard from "./ProductCard";

export default function ProductsContainer({
  products,
  productQuantity,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  // CRUD / form
  handleEdit,
  handleDelete,
  formData,
  handleOnChange,
  handleOnSubmit,
  postResponse,
  isEditing,
}) {
  const getQuantityForProduct = (id) => {
    const pq = productQuantity.find((p) => p.id === id);
    return pq ? pq.quantity : 0;
  };

  return (
    <div className="Products-Container">
      {/* LEFT: Product Form */}
      <div className="Product-Form">
        <h3>Product Form</h3>
        <form onSubmit={handleOnSubmit}>
          <div className="form-group">
            <label htmlFor="id">Product Id</label>
            <input
              id="id"
              name="id"
              value={formData.id}
              onChange={handleOnChange}
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
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleOnChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              value={formData.price}
              onChange={handleOnChange}
              placeholder="$2.50"
              required
            />
          </div>

          <button type="submit">
            {isEditing ? "Update" : "Submit"}
          </button>
        </form>

        {postResponse && <p className="form-message">{postResponse}</p>}
      </div>

      {/* RIGHT: Product Cards */}
      <div className="Products-Grid">
        {products.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            quantity={getQuantityForProduct(product.id)}
            handleAddQuantity={handleAddQuantity}
            handleRemoveQuantity={handleRemoveQuantity}
            handleAddToCart={handleAddToCart}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
