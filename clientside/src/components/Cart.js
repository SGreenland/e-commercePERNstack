import React, { useEffect } from "react";
import useStore from "../Store";
import { cartStore } from "../Store";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";

function Cart(props) {
  const cartItems = cartStore((state) => state.cartItems);
  let i = 0;
  const pricesArr = [];
  const products = useStore((state) => state.products);
  const setValidUser = useStore((state) => state.setValidUser);

  useEffect(() => {
    setValidUser();
    cartItems.map((item) =>
      products.forEach((prod) => {
        if (prod.name === item.name) {
          item.price = prod.price * item.qty;
        }
        useStore.setState({ cartItems: cartItems });
      })
    );
  });
  function clearCart() {
    cartStore.setState({ cartItems: [] });
    useStore.setState({ itemCount: 0 });
  }

  const getPricesArr = async () => {
    for (let i = 0; i < cartItems.length; i++)
      pricesArr.push(cartItems[i].price);
  };

  getPricesArr();

  let total = cartItems.length
    ? pricesArr.reduce((total, current) => total + current).toFixed(2)
    : 0;

  return (
    <div className="cart">
      <table>
        <thead>
          <th colSpan="4" id="cartHead">
            Cart
          </th>
        </thead>
        {cartItems.map((item) => (
          <CartItem item={cartItems[i++]} total={total} />
        ))}
        <tr className="totalRow">
          <th>Total</th>
          <td>£{total}</td>
          <td colSpan="2" id="clearCartField">
            <button className="clearCart" onClick={clearCart}>
              Clear Cart
            </button>
          </td>
        </tr>
        <tfoot>
          <tr>
            <td colSpan="2">
              <button className="cartBtns">
                <Link to="/" style={{display: "block", width: "100%"}}>
                 Back
                </Link>
                
              </button>
            </td>
            <td colSpan="2">
              <button className="cartBtns">
                <Link to={{ pathname: "/checkout", total: total }} style={{display: "block", width: "100%"}}>
                 Checkout
                </Link>
                
              </button>
            </td>
          </tr>
        </tfoot>
      </table>

      <div>{cartItems.length === 0 && <div>Cart is Empty</div>}</div>
    </div>
  );
}

export default Cart;
