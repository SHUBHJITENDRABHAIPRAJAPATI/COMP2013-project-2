// src/Components/ProductsContainer.jsx
import ProductCard from "./ProductCard";

export default function ProductsContainer({
  products,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  productQuantity,
  // CRUD / form
  handleEdit,
  handleDelete,
  formData,
  handleOnChange,
  handleOnSubmit,
  postResponse,
  isEditing,
  // react-hook-form
  register,
  handleSubmit,
  errors,
}) {
  return (
    <div className="Products-Container">
      {/* LEFT: Product Form */}
      <div className="Product-Form">
        <h3>Product Form</h3>
        {/* react-hook-form handles submit */}
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className="form-group">
            <label htmlFor="id">Product Id</label>
            <input
              id="id"
              name="id"
              placeholder="Barcode / Id"
              // react-hook-form
              {...register("id", { required: true })}
              // keep local state in sync
              value={formData.id}
              onChange={handleOnChange}
            />
            {errors.id && <span className="error">Id is required</span>}
          </div>

          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input
              id="productName"
              name="productName"
              {...register("productName", { required: true })}
              value={formData.productName}
              onChange={handleOnChange}
            />
            {errors.productName && (
              <span className="error">Product name is required</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              id="brand"
              name="brand"
              {...register("brand", { required: true })}
              value={formData.brand}
              onChange={handleOnChange}
            />
            {errors.brand && (
              <span className="error">Brand is required</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              {...register("image")}
              value={formData.image}
              onChange={handleOnChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              placeholder="$2.50"
              {...register("price", { required: true })}
              value={formData.price}
              onChange={handleOnChange}
            />
            {errors.price && (
              <span className="error">Price is required</span>
            )}
          </div>

          <button type="submit">{isEditing ? "Update" : "Submit"}</button>
        </form>

        {postResponse && <p className="form-message">{postResponse}</p>}
      </div>

      {/* RIGHT: Product Cards */}
      <div className="ProductsContainer">
        {products.map((product) => (
          <ProductCard
            key={product._id || product.id}
            {...product}
            handleAddQuantity={handleAddQuantity}
            handleRemoveQuantity={handleRemoveQuantity}
            handleAddToCart={handleAddToCart}
            // find quantity for this product id
            productQuantity={
              productQuantity.find((p) => p.id === product.id)?.quantity || 0
            }
            // CRUD
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
