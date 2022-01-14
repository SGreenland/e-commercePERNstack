import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useStore from "../Store";
import { cartStore } from "../Store";

export default function CheckoutForm({ total }) {
  const stripe = useStripe();
  const elements = useElements();
  const [succeeded, setSucceeded] = useState(false);
  // const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [email, setEmail] = useState(sessionStorage.getItem("userEmail"));
  const isValidUser = useStore.getState().isValidUser;
  const btnStyle = { width: "100%", borderRadius: "4px", margin: "5px" };
  var progVal = document.getElementsByTagName("progress")[0];
  var alertBox = document.getElementById("alertBox");
  const cartItems = cartStore((state) => state.cartItems);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads

    const getKey = async () => {
      try {
        const response = await fetch(
          "https://samsfruitstore-pernstack.herokuapp.com/pay",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ total: total, items: cartItems }),
          }
        );

        if (response.ok) {
          const key = await response.json();
          setClientSecret(key.clientSecret);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getKey();
  }, []);

  function progressBar() {
    progVal.style.display = "flex";
    setInterval(() => {
      progVal.value += 1;
      if (progVal.value === 10) {
        progVal.value = 1;
      }
      if (alertBox.style.display === "flex") {
        progVal.style.display = "none";
      }
    }, 250);
  }

  function mustBeLoggedIn() {
    if (!isValidUser) {
      useStore.getState().greyOut();
      alertBox.style.display = "grid";
      alertBox.innerHTML = `You must be logged in to make a payment. <button><a href="/login">Ok</a></button>`;
    }
  }

  async function handleSubmit(e) {
    progressBar();
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: document.getElementById("nameField").value,
        },
      },
      receipt_email: document.getElementById("emailField").value,
    });

    if (payload.error) {
      setProcessing(false);
      useStore.getState().greyOut();
      alertBox.style.display = "grid";
      alertBox.innerHTML = `Payment failed: ${payload.error.message}<button><a href="/">Ok</button>`;
    } else {
      setProcessing(false);
      setSucceeded(true);
      useStore.getState().greyOut();
      alertBox.style.display = "grid";
      alertBox.innerHTML = `Payment was successful! <button><a href="/">Ok</button>`;
    }
  }

  async function storeOrder(e) {
    const items = cartItems.map((item) => {
      return { name: item.name, price: item.price, qty: item.qty };
    });
    const createOrder = await fetch(
      "https://samsfruitstore-pernstack.herokuapp.com/confirm_order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ total: total, items: JSON.stringify(items) }),
      }
    );

    if (createOrder.ok) {
      return;
    } else {
      alert("could not process order");
    }
  }

  function changeEmail(e) {
    setEmail(e.target.value);
  }

  const inputStyle = {
    border: "2px inset rgb(194 106 1)",
    background: "whitesmoke",
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          minWidth: "280px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "white",
        }}
        id="checkout"
      >
        <label>Email</label>
        <input
          style={inputStyle}
          id="emailField"
          type="email"
          placeholder="Email"
          className="formInput"
          required
          value={email}
          onChange={changeEmail}
        ></input>
        <label for="nameField">Name</label>
        <input
          style={inputStyle}
          className="formInput"
          placeholder="Name"
          id="nameField"
          required
        ></input>
        <label>Shipping Address</label>
        <input
          style={inputStyle}
          className="formInput"
          placeholder="Address Line 1"
          required
        ></input>
        <input
          style={inputStyle}
          className="formInput"
          placeholder="Address Line 2"
          required
        ></input>
        <input
          style={inputStyle}
          className="formInput"
          placeholder="Postcode/ZIP"
          required
        ></input>
        <label>Card Details</label>
        <div className="formInput" id="cardInput" style={inputStyle}>
          <CardElement />
        </div>
        <button
          id="payBtn"
          style={btnStyle}
          type="submit"
          disabled={!stripe}
          onClick={storeOrder}
          onMouseOver={mustBeLoggedIn}
        >
          Pay
        </button>
        {
          <progress
            max="10"
            value="1"
            style={{ width: "100%", display: "none" }}
          ></progress>
        }
      </form>
    </>
  );
}
