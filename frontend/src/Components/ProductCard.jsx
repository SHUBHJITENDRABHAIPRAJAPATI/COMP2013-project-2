// src/Components/ProductCard.jsx
import QuantityCounter from "./QuantityCounter";

export default function ProductCard({
  id,
  mongoId, // mongoDB _id (for delete/update)
  productName,
  brand,
  image,
  price,
  productQuantity,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  handleEdit,
  handleDelete,
}) {
  const onAddToCart = () => {
    handleAddToCart(id);
  };
/*as usually, defining onEdit and onDelete functions to call the passed handlers*/
  const onEdit = () => {
    if (!handleEdit) return;
    // Rebuild a product object like what GroceriesAppContainer expects
    handleEdit({
      _id: mongoId,
      id,
      productName,
      brand,
      image,
      price,
    });
  };

  const onDelete = () => {
    if (!handleDelete) return;
    handleDelete(mongoId);
  };

  return (
    <div className="ProductCard">
      <h3>{productName}</h3>
      {image && <img src={image} alt={productName} />}
      <h4>{brand}</h4>

      <QuantityCounter
        handleAddQuantity={handleAddQuantity}
        productQuantity={productQuantity}
        handleRemoveQuantity={handleRemoveQuantity}
        id={id}
        mode="product"
      />

      <h3>{price}</h3>

      <button onClick={onAddToCart}>Add to Cart</button>

      <div className="ProductActions">
        <button type="button" onClick={onEdit}>
          Edit
        </button>
        <button type="button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
