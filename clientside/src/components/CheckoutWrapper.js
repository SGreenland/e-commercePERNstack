import React, { useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import useStore from "../Store";
import { cartStore } from "../Store";
import AlertBox from "./AlertBox";
import CONFIG from "../config";

export default function CheckoutWrapper(props) {
  const cartItems = cartStore((state) => state.cartItems);
  const setValidUser = useStore((state) => state.setValidUser);
  const promise = loadStripe(CONFIG.STRIPE_PUBLIC_KEY);
  const totalCost = props.location.total;
  const paymentFormStyle = { display: "flex", justifyContent: "center" };

  useEffect(() => {
    setValidUser();
  });

  function getTotal() {
    if (cartItems.length) {
      const prices = cartItems.map((item) => item.price);
      return prices.reduce((total, current) => total + current).toFixed(2);
    } else {
      return 0;
    }
  }

  function getItemsNice() {
    function setEmojis() {
      cartItems.forEach((item) => {
        switch (item.name) {
          case "Bananas":
            item.style = "banana";
            break;
          case "Apples":
            item.style = "apple";
            break;
          case "Oranges":
            item.style = "orange";
            break;
          case "Peaches":
            item.style = "peach";
            break;
          case "Melon":
            item.style = "melon";
            break;
          case "Blueberries":
            item.style = "blueberries";
            break;
          default:
            item.style = "none";
        }
      });
    }

    setEmojis();
    const orderSum = cartItems.map((item) => (
      <li value={item.qty} style={{ listStyle: item.style }}>
        {item.name} x ({item.qty}): £{item.price.toFixed(2)}
      </li>
    ));

    return orderSum;
  }

  return (
    <div style={paymentFormStyle}>
      <Elements stripe={promise}>
        <AlertBox />
        <div id="checkout">
          <h3>Order Summary:</h3>
          {getItemsNice()}
          <h3>Total:</h3>£{getTotal()}
          <div
            style={{
              border: "2px solid",
              padding: "8px",
              width: "min-content",
            }}
          >
            <CheckoutForm total={totalCost} />
          </div>
        </div>
      </Elements>
    </div>
  );
}
