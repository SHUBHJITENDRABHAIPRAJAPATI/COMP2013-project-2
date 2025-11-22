// src/Components/CartContainer.jsx
import CartCard from "./CartCard";

export default function CartContainer({
  cartList,
  adjustQuantity,
  removeFromCart,
  clearCart,
}) {
  /*i did get errors to fix handleRemoveFromCart,handleAddQuantity,handleRemoveQuantity,handleClearCart,
  bcz they relied on props functions from parent component GroceriesAppContainer which were not passed down to CartContainer.jsx
  so i defined those functions here in CartContainer.jsx to fix the errors
  refernce:https://react.dev/learn/sharing-state-between-components?utm_source=chatgpt.com
  */

  const handleAddQuantity = (id, mode) => {
    adjustQuantity(id, "inc", "cart");
  };

  const handleRemoveQuantity = (id, mode) => {
    adjustQuantity(id, "dec", "cart");
  };

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const totalPrice = cartList
    .reduce(
      (total, item) =>
        total + parseFloat(item.price.replace("$", "")) * item.qty,
      0
    )
    .toFixed(2);

  return (
    <div className="CartContainer">
      <h2>Cart items: {cartList.length}</h2>
      {cartList.length > 0 ? (
        <>
          {cartList.map((product) => (
            <CartCard
              key={product.id}
              id={product.id}
              image={product.image}
              productName={product.productName}
              price={product.price}
              quantity={product.qty}
              handleRemoveFromCart={handleRemoveFromCart}
              handleAddQuantity={handleAddQuantity}
              handleRemoveQuantity={handleRemoveQuantity}
            />
          ))}
         <div className="CartListBtns">
            <button onClick={() => handleClearCart()} className="RemoveButton">
              Empty Cart
            </button>
            <button id="BuyButton">
              Checkout:{" $"}
              {cartList
                .reduce(
                  (total, item) =>
                    total +
                    parseFloat(item.price.replace("$", "")) * item.quantity,
                  0
                )
                .toFixed(2)}
            </button>
          </div>
        </>
      ) : (
        <h3>No items in cart</h3>
      )}
    </div>
  );
}
